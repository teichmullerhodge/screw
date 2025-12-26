use tauri_plugin_opener::OpenerExt;

use crate::templates::{collect_user_projects, execute_manifest};
pub mod templates; 
pub mod helpers;
pub mod filters;



#[tauri::command]
fn new_project(app: tauri::AppHandle, payload: &str) -> templates::ManifestOperation {
    println!("Starting new project.");
    let conversion = serde_json::from_str(payload);
    let res = match conversion {
        Ok(p) => execute_manifest(app, p),
        Err(_err) => templates::ManifestOperation::ErrorInvalidJson
    };

    res 
}



#[tauri::command]
fn read_projects() -> Vec<templates::UserTemplateResult> {
    match collect_user_projects() {
        Ok(p) => p,
        Err(_err) => vec![]
    }
}


// the path come from the frontend as language/category/project-name, it should
// be joined here
#[tauri::command] 
fn open_project_folder(app: tauri::AppHandle, path: String) -> bool {
    let res = app.opener().open_path(path, None::<&str>); // is this right?
    res.is_ok()
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![new_project, read_projects, open_project_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
