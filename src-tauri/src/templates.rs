use serde::Deserialize;
use serde::Serialize;
use crate::helpers::dir_size;
use crate::helpers::now_ms;
use crate::helpers::read_file;
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
pub struct OSActionStep {
    #[serde(deserialize_with = "deserialize_action")]
    pub action: OSActions,
    pub path: String,
    pub value: String,
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
pub struct TemplateManifest {
    name: String,
    language: String, 
    category: String,
    steps: Vec<OSActionStep>
}

pub fn step_error(action: OSActions) -> () {
    let _ = match action {
        OSActions::Mkdir => println!("Error in step [MKDIR]"),
        OSActions::CreateFile => println!("Error in step [CREATE-FILE]"),
        OSActions::WriteToFile => println!("Error in step [WRITE-TO-FILE]")
    };
}


pub fn get_sketch_config_dir_path() -> std::path::PathBuf {
    dirs_next::config_dir().expect("Could not open the config dir").join("sketch")
}

pub fn get_sketch_projects_path() -> std::path::PathBuf {
    dirs_next::document_dir().expect("Could not find the document dir").join("sketch").join("projects")
}

#[derive(Serialize, Clone)]
#[serde(into = "u8")]
pub enum ManifestOperation {
    Success = 0,
    ErrorInvalidJson = 1,
    ErrorCreatingDir = 2,
    ErrorCreatingFile = 3,
    ErrorWritingToFile = 4,
    ErrorReadingFromFile = 5,
}

impl From<ManifestOperation> for u8 {
    fn from(res: ManifestOperation) -> u8 {
        res as u8
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserTemplate {
    name: String,
    author: String,
    created_at: i64,
    updated_at: i64, 
    category: String, 
    language: String,
    path: String 
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserTemplateResult {
    #[serde(flatten)]
    pub base: UserTemplate,
    pub size: u64
}



pub fn build_manifest_json(template: &TemplateManifest, path: String) -> UserTemplate {
    let now = now_ms();
    UserTemplate {
        name: template.name.clone(), 
        author: "".to_string(), // TODO 
        created_at: now, 
        updated_at: now, 
        category: template.category.clone(),
        language: template.language.clone(),
        path: path
    }
}


#[derive(Debug, Deserialize, Serialize)]
pub struct ConfigTemplatesLocation {
    templates: Vec<String>,
}


pub enum UserProjectsOperation {
    UserProjectsOk = 0,
    NoConfigFile = 1,
    ErrorReadingConfigFile = 2,
    PartialManifestErrors = 3,
}

pub fn collect_user_projects() -> Result<Vec<UserTemplateResult>, UserProjectsOperation> {
    let mut user_projects: Vec<UserTemplateResult> = Vec::new();
    let config_path = get_sketch_config_dir_path().join(SKETCH_CONFIG_FILE);
    if !config_path.exists() {
        return Err(UserProjectsOperation::NoConfigFile)
    }
    let contents = read_file(config_path); 
    if contents.is_err() {
        eprintln!("Error reading config file at collect_user_projects");
        return Err(UserProjectsOperation::ErrorReadingConfigFile);
    }

    let configs: ConfigTemplatesLocation = serde_json::from_str(&contents.unwrap_or("".to_string())).unwrap_or(ConfigTemplatesLocation { templates: Vec::new() });
    for paths in configs.templates {
        let root_path = std::path::PathBuf::new().join(paths);
        let sketch_path = root_path.join(SKETCH_MANIFEST_FILE);
        let sketch_contents = read_file(sketch_path);
        if sketch_contents.is_err() {
            eprintln!("Error reading manifest file at project in collect_user_projects.");
            continue 
        }
        let sketch_string = sketch_contents.unwrap_or("".to_string());
        let project_manifest: Result<UserTemplate, serde_json::Error> = serde_json::from_str(&sketch_string);
        if project_manifest.is_err() {
            eprintln!("Error parsing manifest file at project in collect_user_projects");
            continue 
        }

        let folder_size = dir_size(&root_path).unwrap_or(0);
        let manifest_result = UserTemplateResult {
            base: project_manifest.unwrap(),
            size: folder_size 
        };
        user_projects.push(manifest_result);
    }

    Ok(user_projects)
}

const SKETCH_CONFIG_FILE: &str   = ".sketch.projects.json";
const SKETCH_CONFIG_FILE_INITIAL_VALUE: &str = r#"{
    "templates": []
}"#;

pub enum ConfigProjectsResult {
    ConfigOk = 0,
    ErrorCreatingDir = 1,
    ErrorCreatingFile = 2,
    ErrorWritingToFile = 3,
    ErrorReadingFromFile = 4
}


pub fn save_template_to_config_file(template_path: std::path::PathBuf) -> ConfigProjectsResult {
    let config = get_sketch_config_dir_path();
    if !config.exists() {
     let config_res = mkdir(config.clone());
     if config_res.is_err() {
          eprintln!("Error creating the config/sketch directory.");   
          return ConfigProjectsResult::ErrorCreatingDir;
        }
    }
    let config_file_path = config.join(SKETCH_CONFIG_FILE);
    let projects_file_exists = config_file_path.exists();
    if !projects_file_exists {
        let create_res = create_file(config_file_path.clone(), Some(SKETCH_CONFIG_FILE_INITIAL_VALUE.to_string()));
        if create_res.is_err() {
              eprintln!("Error creating the config/sketch file.");
              return ConfigProjectsResult::ErrorCreatingFile;
        }
    }

    // the file and directory exists at this point. 
    let contents = read_file(config_file_path.clone());
    if contents.is_err() {
        eprintln!("Error reading the config file.");
        return ConfigProjectsResult::ErrorReadingFromFile;
    }

    let mut config_file: ConfigTemplatesLocation = serde_json::from_str(&contents.unwrap_or("".to_string())).unwrap_or(ConfigTemplatesLocation { templates: Vec::new() });
    config_file.templates.push(template_path.display().to_string()); // attention to this fuckness.
    // Maybe this is not right. 
    let string_contents = match serde_json::to_string_pretty(&config_file) {
        Ok(s) => s, 
        Err(e) => {
         eprintln!("Error at config serialize: {e}");
         SKETCH_CONFIG_FILE_INITIAL_VALUE.to_string() // fucking ugly, should proper deal with this later.
        }
    };
    
    let write_res = write_to_file(config_file_path, string_contents);
    if write_res.is_err() {
        eprintln!("Error writing a new project to the config file.");
        return ConfigProjectsResult::ErrorWritingToFile;
    }
    ConfigProjectsResult::ConfigOk
}

const SKETCH_MANIFEST_FILE: &str = ".sketch.manifest.json";

pub fn execute_manifest(app: tauri::AppHandle, template: TemplateManifest) -> (Option<String>, ManifestOperation) {
    println!("Executing template: {}", template.name);
    let root = get_sketch_projects_path().join(template.language.clone()).join(template.category.clone()).join(template.name.clone());
    let user_manifest = build_manifest_json(&template, root.display().to_string());    
    for step in template.steps {
    match step.action {
        OSActions::Mkdir => {
            let res = mkdir(root.join(step.path));
            if res.is_err() { 
                step_error(step.action); 
                return (None, ManifestOperation::ErrorCreatingDir); 
            }
        }
        OSActions::CreateFile => {
            let res = create_file(root.join(step.path), None);
            if res.is_err() { 
                step_error(step.action); 
                return (None, ManifestOperation::ErrorCreatingFile); 
            }
        }
        OSActions::WriteToFile => {
            let contents = if step.is_file_path.unwrap_or(false) {
                match read_template(&app, step.value.clone().into()) {
                    Ok(data) => data,
                    Err(err) => {
                        eprintln!("Error reading {}: {}", step.value, err);
                        return (None, ManifestOperation::ErrorReadingFromFile);
                    }
                }
            } else {
                step.value.clone()
            };

            let res = write_to_file(root.join(step.path), contents);
            if res.is_err() { 
                step_error(step.action); 
                return (None, ManifestOperation::ErrorWritingToFile); 
            }

            }
        } 
    }
    // everything is okay. Let's write the manifest in the root of the project. 
    let res = create_file(root.join(SKETCH_MANIFEST_FILE), None);
    if res.is_err() {
        eprintln!("Error creating the manifest file.");
    }
    
    let manifest_string = match serde_json::to_string_pretty(&user_manifest) {
        Ok(s) => s,
        Err(e) => {
        eprintln!("Error at manifest serialize: {e}");
        "".to_string()
        }
    };
    
    let wr = write_to_file(root.join(SKETCH_MANIFEST_FILE), manifest_string);
    if wr.is_err() {
      eprintln!("Error writing to the manifest file.");   
    }

    let config_res = save_template_to_config_file(root.clone());
    match config_res {
        ConfigProjectsResult::ConfigOk => eprintln!("Properly appended the project to the config file."),
        _ => eprintln!("Error in the handle_config_project method.")
    } 
    (Some(root.display().to_string()), ManifestOperation::Success)
}
