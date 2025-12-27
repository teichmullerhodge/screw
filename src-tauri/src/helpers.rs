use std::io::Write;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager};

use crate::templates::get_sketch_config_dir_path;

pub fn mkdir(path: PathBuf) -> Result<(), std::io::Error> {
    if let Err(e) = std::fs::create_dir_all(&path) {
        eprintln!("Failed to create directory {:?}: {}", path, e);
        return Err(e);
    }
    Ok(())
}

pub fn read_file(path: PathBuf) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}

pub fn read_template(app: &AppHandle, relative_path: PathBuf) -> Result<String, String> {
    let mut path: PathBuf = app.path().resource_dir().map_err(|e| e.to_string())?;

    path.push(relative_path);

    std::fs::read_to_string(path).map_err(|e| e.to_string())
}

pub fn create_file(path: PathBuf, contents: Option<String>) -> Result<(), Box<dyn std::error::Error>> {
    let mut file = match std::fs::File::create(&path) {
        Ok(f) => f,
        Err(e) => {
            eprintln!("Failed to create file {:?}: {}", path, e);
            return Err(Box::new(e));
        }
    };

    if let Some(data) = contents {
        if let Err(e) = file.write_all(data.as_bytes()) {
            eprintln!("Failed to write to file {:?}: {}", path, e);
            return Err(Box::new(e));
        }
    }

    Ok(())
}

pub fn write_to_file(path: PathBuf, contents: String) -> Result<(), Box<dyn std::error::Error>> {
    let mut file = match std::fs::OpenOptions::new().write(true).open(&path) {
        Ok(f) => f,
        Err(e) => {
            eprintln!("Failed to open file {:?}: {}", path, e);
            return Err(Box::new(e));
        }
    };

    if let Err(e) = file.write_all(contents.as_bytes()) {
        eprintln!("Failed to write to file {:?}: {}", path, e);
        return Err(Box::new(e));
    }

    Ok(())
}

pub fn dir_size(path: &std::path::Path) -> std::io::Result<u64> {
    let mut size = 0;

    for entry in std::fs::read_dir(path)? {
        let entry = entry?;
        let meta = entry.metadata()?;

        if meta.is_dir() {
            size += dir_size(&entry.path())?;
        } else {
            size += meta.len();
        }
    }

    Ok(size)
}

pub fn now_ms() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis() as i64
}

pub fn random_timestamp_string() -> String {

    SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_nanos()
    .to_string()

}

pub fn persist_asset(path: String) -> Result<String, String> {
    let src = std::path::PathBuf::from(&path);

    let target_dir = get_sketch_config_dir_path().join("assets"); 
 


    let target = target_dir.join(
        src.file_name()
        .unwrap_or(std::ffi::OsStr::new(&format!("assets_{}", random_timestamp_string())))
    );


    std::fs::create_dir_all(&target_dir).map_err(|e| e.to_string())?;
    std::fs::copy(&src, &target).map_err(|e| e.to_string())?;

    Ok(target.to_string_lossy().to_string())
}

