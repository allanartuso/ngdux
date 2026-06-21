import os
import json
import torch
from datasets import Dataset
from unsloth import FastLanguageModel
from trl import SFTTrainer
from transformers import TrainingArguments

# 1. Hardware Configuration Strategy
max_seq_length = 2048 # Perfect balance for 16GB VRAM memory safety
dtype = None          # Auto-detects system architecture (Bfloat16 for modern cards)
load_in_4bit = True   # Reduces Qwen3.5-9B footprint to fit safely into your VRAM

# 2. Loading the modern Qwen3.5-9B baseline via Unsloth kernel adapters
print("🤖 Loading Unsloth pre-quantized Qwen3.5-9B-Base model...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Qwen3.5-9B-Base",
    max_seq_length = max_seq_length,
    dtype = dtype,
    load_in_4bit = load_in_4bit,
)

# 3. Setup Parameter-Efficient LoRA Target Adapters
model = FastLanguageModel.get_peft_model(
    model,
    r = 32,               # Rank 32 is optimal for deep syntax adaptation tasks
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha = 32,
    lora_dropout = 0,     # 0 is mathematically optimized for Unsloth processing speed
    bias = "none",
    use_gradient_checkpointing = "unsloth", # Crucial VRAM saver for 16GB cards
    random_state = 3407,
    use_rslora = False,
    loftq_config = None,
)

# 4. ChatML Formatting Pipeline
def apply_qwen_template(row):
    messages = row["messages"]
    # Compiles raw list arrays directly into Qwen's specific Jinja block structures
    formatted_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)
    return {"text": formatted_text}

# 5. Load your consolidated dataset rows
print("📂 Loading final consolidated dataset file...")
training_records = []
with open("final_training_dataset.jsonl", "r", encoding="utf-8") as file:
    for line in file:
        if line.strip():
            training_records.append(json.loads(line))

# Inject into HuggingFace pipeline layout and map templates
dataset = Dataset.from_list(training_records)
dataset = dataset.map(apply_qwen_template)

# 6. Configure Supervised Fine-Tuning Execution Engine with Checkpointing
trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset,
    dataset_text_field = "text",
    max_seq_length = max_seq_length,
    dataset_num_proc = 2,
    packing = False,      # Kept at false to treat your class methods as clean discrete objects
    args = TrainingArguments(
        per_device_train_batch_size = 2,  # Low batch step protects your card limits
        gradient_accumulation_steps = 4,  # Replicates an excellent virtual batch size of 8
        warmup_steps = 10,
        num_train_epochs = 3,             # 3 epochs is the sweet spot for learning code patterns
        learning_rate = 2e-4,
        fp16 = not torch.cuda.is_bf16_supported(),
        bf16 = torch.cuda.is_bf16_supported(),
        logging_steps = 5,
        optim = "adamw_8bit",             # Uses 8-bit optimizer to offload active VRAM weight
        weight_decay = 0.01,
        lr_scheduler_type = "cosine",     # Smooth curve adjustment for stable logic extraction
        seed = 3407,
        output_dir = "unsloth_qwen_checkpoints", # Base folder where checkpoints are created

        # --- NEW CHECKPOINT CONFIGURATIONS ---
        save_strategy = "steps",          # Save based on number of training steps completed
        save_steps = 50,                  # Create a recovery checkpoint every 50 steps
        save_total_limit = 2,             # Keep only the last 2 checkpoints to prevent filling your hard drive
    ),
)

# 7. Start the Training Run (Checks for existing recovery checkpoints first)
print("🔥 Launching Unsloth training loops. Keep an eye on your VRAM metrics...")

checkpoint_dir = "unsloth_qwen_checkpoints"
resume_from = None

# Automatically detect if a checkpoint exists from a previous run to resume
if os.path.exists(checkpoint_dir) and os.listdir(checkpoint_dir):
    subdirs = [os.path.join(checkpoint_dir, d) for d in os.listdir(checkpoint_dir) if d.startswith("checkpoint")]
    if subdirs:
        resume_from = max(subdirs, key=os.path.getmtime)
        print(f"🔄 Found checkpoint! Auto-resuming from: {resume_from}")

trainer_stats = trainer.train(resume_from_checkpoint = resume_from)
print("🎉 Model fine-tuning successfully finished!")

# 8. Automated GGUF compilation for immediate loading into LM Studio
print("📦 Compiling LoRA parameters into a singular GGUF file for local hosting...")
model.save_pretrained_gguf("my_custom_qwen3.5_angular", tokenizer, quantization_method = "q4_k_m")
print("🚀 All actions complete! Load 'my_custom_qwen3.5_angular-Q4_K_M.gguf' in LM Studio.")
