import os
import json

def inject_custom_anchor_tag(input_file: str, output_file: str):
    """
    Reads the final dataset and forces every single system prompt
    to use the exact custom 'MyGuy-260621' trigger token.
    """
    if not os.path.exists(input_file):
        print(f"❌ Error: Could not find target file: {input_file}")
        return

    updated_records = 0
    new_anchor = "You are a first-class Angular dev coding like MyGuy-260621"

    print(f"🔄 Scanning '{input_file}' to inject new anchor token...")

    with open(input_file, "r", encoding="utf-8") as infile, \
         open(output_file, "w", encoding="utf-8") as outfile:

        for line_number, line in enumerate(infile, 1):
            if not line.strip():
                continue

            try:
                record = json.loads(line)
                messages = record.get("messages", [])

                # Find the system message dictionary block and swap its content
                system_found = False
                for msg in messages:
                    if msg.get("role") == "system":
                        msg["content"] = new_anchor
                        system_found = True
                        break

                # Fallback safeguard: if a row lacks a system block entirely, inject it at index 0
                if not system_found:
                    messages.insert(0, {"role": "system", "content": new_anchor})

                # Write the updated clean JSON line out
                outfile.write(json.dumps(record, ensure_ascii=False) + "\n")
                updated_records += 1

            except json.JSONDecodeError as e:
                print(f"⚠️ Error reading JSON line {line_number}: {e}. Skipping row.")

    print("\n")
    print(f"==================================================")
    print(f"🎉 System Prompt Injection Successful!")
    print(f"   -> Updated File: {os.path.abspath(output_file)}")
    print(f"   -> Total Rows Customized: {updated_records}")
    print(f"==================================================")

if __name__ == "__main__":
    target_input = "final_training_dataset.jsonl"
    target_output = "final_training_dataset_myguy.jsonl"

    inject_custom_anchor_tag(target_input, target_output)
