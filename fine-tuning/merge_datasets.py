import os
import json
import glob

def clean_text(text):
    """Removes annoying Windows carriage return artifacts."""
    if isinstance(text, str):
        return text.replace("\r\n", "\n").replace("\r", "\n")
    return text

def extract_messages(data_chunk):
    """
    Recursively drills down into arrays to find the actual dictionary
    that holds the 'messages' array key.
    """
    if isinstance(data_chunk, dict):
        if "messages" in data_chunk and isinstance(data_chunk["messages"], list):
            return data_chunk["messages"]
    elif isinstance(data_chunk, list):
        for item in data_chunk:
            found = extract_messages(item)
            if found:
                return found
    return None

def merge_all_datasets(input_folder: str, output_file_name: str):
    """
    Robustly scans, flattens, cleans, and merges all dataset mutations
    into a singular unified file ready for Unsloth.
    """
    search_path = os.path.join(input_folder, "*.*")
    all_files = glob.glob(search_path)

    target_extensions = ('.jsonl', '.json')
    dataset_files = [f for f in all_files if f.endswith(target_extensions) and output_file_name not in f]

    print(f"🔍 Analyzing and recovering {len(dataset_files)} dataset layers...")

    total_records = 0
    recovered_records = 0
    failed_records = 0

    with open(output_file_name, "w", encoding="utf-8") as outfile:
        for file_path in dataset_files:
            file_basename = os.path.basename(file_path)

            with open(file_path, "r", encoding="utf-8") as infile:
                for line_number, line in enumerate(infile, 1):
                    cleaned_line = line.strip()
                    if not cleaned_line:
                        continue

                    # Clean brackets, commas, or trailing fragments left over from array dumps
                    if cleaned_line.endswith(','):
                        cleaned_line = cleaned_line[:-1].strip()

                    try:
                        parsed_json = json.loads(cleaned_line)

                        # Use our extraction utility to hunt down the 'messages' block
                        messages_array = extract_messages(parsed_json)

                        if messages_array:
                            # Sanitize text roles to clean up formatting issues
                            for msg in messages_array:
                                msg["content"] = clean_text(msg["content"])

                            # Assemble the final standardized line block
                            final_record = {"messages": messages_array}
                            outfile.write(json.dumps(final_record, ensure_ascii=False) + "\n")

                            # Track if this came from a recovered nested array or a standard line
                            if isinstance(parsed_json, list):
                                recovered_records += 1
                            else:
                                total_records += 1
                        else:
                            failed_records += 1

                    except json.JSONDecodeError:
                        # If a single line can't be parsed, it might be a multi-line format check
                        failed_records += 1

    print("\n")
    print(f"==================================================")
    print(f"🎉 Merging Optimization Complete!")
    print(f"   -> Destination: {os.path.abspath(output_file_name)}")
    print(f"   -> Standard Lines Transferred: {total_records}")
    print(f"   -> Nested Blocks Successfully Recovered: {recovered_records}")
    print(f"   -> Unparseable Rows Dropped: {failed_records}")
    print(f"==================================================")

if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__)) if __file__ else "."
    output_target = "final_training_dataset.jsonl"

    merge_all_datasets(current_directory, output_target)
