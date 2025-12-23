use std::io::Write;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};


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
    let mut path: PathBuf = app.path()
        .resource_dir()
        .map_err(|e| e.to_string())?;

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

