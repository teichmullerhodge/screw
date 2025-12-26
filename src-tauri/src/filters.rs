
use serde::Deserialize;
use serde::Serialize;

use crate::helpers::create_file;
use crate::helpers::read_file;
use crate::helpers::write_to_file;
use crate::templates::get_sketch_config_dir_path;

#[derive(Debug, Deserialize, Serialize)]
pub struct CommonFilter {
    name: String,
    image: String, // image path  
}

#[derive(Debug, Deserialize, Serialize)]
pub struct CommonFilterPayload <'a> {
    name: String,
    image: String, 
    key: &'a str 
}



#[derive(Debug, Deserialize, Serialize)]
pub struct Filters {
    languages: Vec<CommonFilter>,
    categories: Vec<CommonFilter>

}

pub enum FiltersOperation {
    Success = 0,
    ErrorReadingFromFile = 1,
    ErrorWritingToFile = 2,
    ErrorCreatingFile = 3,
    ErrorParsingJson = 4,
    ErrorSerializingJson = 5
}



const SKETCH_FILTERS_FILE: &str = ".sketch.filters.json";
const SKETCH_FILTERS_INITIAL_VALUE: &str = r#"{
    "languages": [],
    "categories": []
}"#;


pub fn list_filters() -> (Option<Filters>, FiltersOperation) {
    let filters_path = get_sketch_config_dir_path().join(SKETCH_FILTERS_FILE);
    if !filters_path.exists() {
        let res = create_file(filters_path.clone(), Some(SKETCH_FILTERS_INITIAL_VALUE.to_string()));
        if res.is_err() {
                eprintln!("Error creating the filters file.");
                return (None, FiltersOperation::ErrorCreatingFile)
        }
    }
    
    let contents = match read_file(filters_path.clone()) {
       Ok(s) => s, 
       Err(err) => {
            eprintln!("Error reading file: {}", err);
            return (None, FiltersOperation::ErrorReadingFromFile)
        }
    };

    let parsed_res = serde_json::from_str(&contents);
    if  parsed_res.is_err() {
        eprintln!("Error parsing json file.");
        return (None, FiltersOperation::ErrorParsingJson)
    }

    let parsed: Filters = parsed_res.unwrap();
    return (Some(parsed), FiltersOperation::Success)


}

pub fn add_filters(payload: CommonFilterPayload) -> (bool, FiltersOperation) {
    let filters_path = get_sketch_config_dir_path().join(SKETCH_FILTERS_FILE);
    if !filters_path.exists() {
        let res = create_file(filters_path.clone(), Some(SKETCH_FILTERS_INITIAL_VALUE.to_string()));
        if res.is_err() {
                eprintln!("Error creating the filters file.");
                return (false, FiltersOperation::ErrorCreatingFile)
        }
    }
    
    let contents = match read_file(filters_path.clone()) {
       Ok(s) => s, 
       Err(err) => {
            eprintln!("Error reading file: {}", err);
            return (false, FiltersOperation::ErrorReadingFromFile)
        }
    };

    let parsed_res = serde_json::from_str(&contents);
    if  parsed_res.is_err() {
        eprintln!("Error parsing json file.");
        return (false, FiltersOperation::ErrorParsingJson)
    }

    let mut parsed: Filters = parsed_res.unwrap();
    match payload.key {
        "languages" => parsed.languages.push(CommonFilter { name: payload.name, image: payload.image }),
        "categories" => parsed.categories.push(CommonFilter { name: payload.name, image: payload.image }),
        _ => {}
    } 
    let str_contents = match serde_json::to_string_pretty(&parsed) {
        Ok(s) => s, 
        Err(_) => {
            eprintln!("Error in serialization on add filters.");
            return (false, FiltersOperation::ErrorSerializingJson);
        }
    };
    
    let res = write_to_file(filters_path, str_contents);
    match res.is_ok() {
        false => return (false, FiltersOperation::ErrorWritingToFile),
        true => return (true, FiltersOperation::Success)
    }
}

