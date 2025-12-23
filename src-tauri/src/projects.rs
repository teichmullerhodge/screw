use serde::Deserialize;

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

pub fn execute_manifest(project: ProjectManifest) -> bool {
    println!("Executing manifest: {}", project.name);
    let root = projects_root().join(project.name);
    for step in project.steps {
    match step.action {
        OSActions::Mkdir => {
            let res = mkdir(root.join(step.path));
            if res.is_err() { 
                step_error(step.action); 
                return false; 
            }
        }
        OSActions::CreateFile => {
            let res = create_file(root.join(step.path), None);
            if res.is_err() { 
                step_error(step.action); 
                return false; 
            }
        }
        OSActions::WriteToFile => {
            let res = write_to_file(root.join(step.path), step.value);
            if res.is_err() { 
                step_error(step.action); 
                return false; 
            }
      
            }
        } 
    }

    true
}
