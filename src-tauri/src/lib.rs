use crate::projects::{ execute_manifest };

pub mod projects; 
pub mod helpers;

#[tauri::command]
fn new_project(payload: &str) -> bool {
    println!("Starting new project.");
    let conversion = serde_json::from_str(payload);
    let res = match conversion {
        Ok(p) => execute_manifest(p),
        Err(_err) => false 
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
