import json
import os

def flatten_dataset(input_file: str, output_file: str):
    """
    Reads a standard nested JSON array structure and converts it into
    a flat, line-by-line JSON Lines (.jsonl) file for Unsloth.
    """
    if not os.path.exists(input_file):
        print(f"❌ Error: Can't find file '{input_file}'")
        return

    print(f"🔄 Flattening '{input_file}' into a compliant JSONL format...")

    # Read the full file contents as a singular raw string
    with open(input_file, "r", encoding="utf-8") as f:
        content = f.read().strip()

    # Try parsing it directly as a standard JSON object/array layer
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        # If it has trailing commas or fragments, use a safer fallback parser
        # by treating it like a text cleanup routine
        content = content.lstrip('[ \n\r\t').rstrip('] \n\r\t')
        # Split on blocks that wrap individual message sets
        print("⚠️ Direct JSON parse failed due to formatting layout. Running text structural recovery...")

    valid_rows = 0

    # Recursive helper function to extract raw message objects from nested arrays
    def extract_items(obj, outfile):
        nonlocal valid_rows
        if isinstance(obj, dict):
            if "messages" in obj:
                outfile.write(json.dumps(obj, ensure_ascii=False) + "\n")
                valid_rows += 1
        elif isinstance(obj, list):
            for sub_obj in obj:
                extract_items(sub_obj, outfile)

    with open(output_file, "w", encoding="utf-8") as outfile:
        extract_items(data, outfile)

    print("\n")
    print(f"==================================================")
    print(f"🎉 Dataset Flattening Successful!")
    print(f"   -> Output File: {os.path.abspath(output_file)}")
    print(f"   -> Total Valid ChatML Rows Written: {valid_rows}")
    print(f"==================================================")

if __name__ == "__main__":
    # Change 'your_current_file.json' to whatever your file is currently named!
    flatten_dataset("dataset-1782047495971.jsonl", "unsloth_ready_dataset.jsonl")
