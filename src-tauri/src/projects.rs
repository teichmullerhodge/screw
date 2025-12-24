use serde::Deserialize;
use serde::Serialize;
use serde_json::json;
use crate::helpers::now_ms;
use crate::helpers::read_template;
use crate::helpers::{create_file, mkdir, write_to_file};


#[derive(Debug, Deserialize)]
pub enum OSActions {
    Mkdir,
    CreateFile,
    WriteToFile,
}

impl TryFrom<u8> for OSActions {
    type Error = ();

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(OSActions::Mkdir),
            1 => Ok(OSActions::CreateFile),
            2 => Ok(OSActions::WriteToFile),
            _ => Err(()),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct ProjectStep {
    #[serde(deserialize_with = "deserialize_action")]
    pub action: OSActions,
    pub path: String,
    pub value: String,
    #[serde(rename = "isFilePath")]
    pub is_file_path: Option<bool>
}

fn deserialize_action<'de, D>(deserializer: D) -> Result<OSActions, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let v = u8::deserialize(deserializer)?;
    OSActions::try_from(v).map_err(|_| serde::de::Error::custom("Invalid action"))
}

#[derive(Debug, Deserialize)]
pub struct ProjectManifest {
    name: String,
    language: String, 
    category: String,
    steps: Vec<ProjectStep>
}

pub fn step_error(action: OSActions) -> () {
    let _ = match action {
        OSActions::Mkdir => println!("Error in step [MKDIR]"),
        OSActions::CreateFile => println!("Error in step [CREATE-FILE]"),
        OSActions::WriteToFile => println!("Error in step [WRITE-TO-FILE]")
    };
}

pub fn projects_root() -> std::path::PathBuf {
    dirs_next::document_dir().expect("Could not find the document dir").join("sketch").join("projects")
}

#[derive(Serialize, Clone)]
#[serde(into = "u8")]
pub enum ManifestResult {
    ProjectOk = 0,
    ErrorInvalidJson = 1,
    ErrorCreatingDir = 2,
    ErrorCreatingFile = 3,
    ErrorWritingToFile = 4,
    ErrorReadingFromFile = 5,
}

impl From<ManifestResult> for u8 {
    fn from(res: ManifestResult) -> u8 {
        res as u8
    }
}

pub fn build_manifest_json(project: &ProjectManifest) -> serde_json::Value {
    let now = now_ms();
    json!({
        "name": project.name,
        "author": "", // TODO
        "createdAt": now,
        "updatedAt": now,
        "category": project.category,
        "language": project.language

    })
}

const SKETCH_MANIFEST_FILE: &str = ".sketch.manifest.json";

pub fn execute_manifest(app: tauri::AppHandle, project: ProjectManifest) -> ManifestResult {
    println!("Executing manifest: {}", project.name);
    let user_manifest = build_manifest_json(&project);    
    let root = projects_root().join(project.language).join(project.category).join(project.name);
    for step in project.steps {
    match step.action {
        OSActions::Mkdir => {
            let res = mkdir(root.join(step.path));
            if res.is_err() { 
                step_error(step.action); 
                return ManifestResult::ErrorCreatingDir; 
            }
        }
        OSActions::CreateFile => {
            let res = create_file(root.join(step.path), None);
            if res.is_err() { 
                step_error(step.action); 
                return ManifestResult::ErrorCreatingFile; 
            }
        }
        OSActions::WriteToFile => {
            let contents = if step.is_file_path.unwrap_or(false) {
                match read_template(&app, step.value.clone().into()) {
                    Ok(data) => data,
                    Err(err) => {
                        eprintln!("Error reading {}: {}", step.value, err);
                        return ManifestResult::ErrorReadingFromFile;
                    }
                }
            } else {
                step.value.clone()
            };

            let res = write_to_file(root.join(step.path), contents);
            if res.is_err() { 
                step_error(step.action); 
                return ManifestResult::ErrorWritingToFile; 
            }

            }
        } 
    }
    // everything is okay. Let's write the manifest in the root of the project. 
    let res = create_file(root.join(SKETCH_MANIFEST_FILE), None);
    if res.is_err() {
        eprintln!("Error creating the manifest file.");
    }

    let wr = write_to_file(root.join(SKETCH_MANIFEST_FILE), serde_json::to_string_pretty(&user_manifest).unwrap_or(user_manifest.to_string()));
    if wr.is_err() {
      eprintln!("Error writing to the manifest file.");   
    }
    ManifestResult::ProjectOk
}
