use crate::projects::{ execute_manifest };

pub mod projects; 
pub mod helpers;

#[tauri::command]
fn new_project(app: tauri::AppHandle, payload: &str) -> projects::ManifestResult {
    println!("Starting new project.");
    let conversion = serde_json::from_str(payload);
    let res = match conversion {
        Ok(p) => execute_manifest(app, p),
        Err(_err) => projects::ManifestResult::ErrorInvalidJson
    };

    res 
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![new_project])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
