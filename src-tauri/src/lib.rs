use tauri_plugin_opener::OpenerExt;

use crate::{helpers::persist_asset, templates::{collect_user_projects, execute_manifest}};
pub mod filters;
pub mod helpers;
pub mod templates;

#[tauri::command]
fn new_project(app: tauri::AppHandle, payload: &str) -> (Option<String>, templates::ManifestOperation) {
    println!("Starting new project.");
    let conversion = serde_json::from_str(payload);
    let res = match conversion {
        Ok(p) => execute_manifest(app, p),
        Err(_err) => (None, templates::ManifestOperation::ErrorInvalidJson),
    };
    res
}

#[tauri::command]
fn read_projects() -> Vec<templates::UserTemplateResult> {
    match collect_user_projects() {
        Ok(p) => p,
        Err(_err) => vec![],
    }
}

// the path come from the frontend as language/category/project-name, it should
// be joined here
#[tauri::command]
fn open_project_folder(app: tauri::AppHandle, path: String) -> bool {
    let res = app.opener().open_path(path, None::<&str>); // is this right?
    res.is_ok()
}

#[tauri::command]
fn add_filter(payload: &str) -> (Option<String>, bool) {
    let conversion: Result<filters::CommonFilterPayload, serde_json::Error> = serde_json::from_str(payload);
    let res = match conversion {
        Ok(c) => c,
        Err(_err) => return (None, false)
    };

    let path = match persist_asset(res.image_path) {
        Ok(p) => p,
        Err(_err) => return (None, false)
    };

    let persist_filter = filters::CommonFilterPayload {
        name: res.name,
        image_path: path.clone(),
        key: res.key
    };
   
    let save_res = filters::save_filter(persist_filter);
    match save_res.0 {
        true => return (Some(path), true),
        _ => return (None, false)
    }
}


#[tauri::command]
fn list_filters() -> (Option<filters::Filters>, u8) {
    let (filters, op) = filters::list_filters();
    (filters, op as u8)
}






#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            new_project,
            read_projects,
            open_project_folder,
            add_filter,
            list_filters

        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
