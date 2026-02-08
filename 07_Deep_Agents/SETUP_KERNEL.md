# Make "07_Deep_Agents" show as a notebook kernel

Run these in your **terminal** from the `07_Deep_Agents` folder.

## Option A: You use a venv in this folder

```bash
cd /Users/rahul/Documents/AIE9/07_Deep_Agents

# Create venv (if you don't have one yet)
python3 -m venv .venv

# Activate it
source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate    # Windows

# Install kernel support + project deps
pip install ipykernel "deepagents>=0.3.0" jupyter

# Register the kernel so it appears in the list
python -m ipykernel install --user --name 07_Deep_Agents --display-name "Python (07_Deep_Agents)"
```

Then in Cursor: **Kernel** → **Select Another Kernel…** → **Jupyter Kernel…** → choose **"Python (07_Deep_Agents)"**.

---

## Option B: You use conda env named "07_Deep_Agents"

```bash
conda activate 07_Deep_Agents
pip install ipykernel
python -m ipykernel install --user --name 07_Deep_Agents --display-name "Python (07_Deep_Agents)"
```

Restart Cursor (or reload the window), then pick **"Python (07_Deep_Agents)"** in the kernel list.

---

## Option C: Pick interpreter without registering a kernel

1. In the notebook, click the **kernel name** (top right).
2. **Select Another Kernel…** → **Python Environments…**.
3. Choose **Enter path to Python interpreter**.
4. Paste the **full path** to the Python of your env, e.g.:
   - Venv: `/Users/rahul/Documents/AIE9/07_Deep_Agents/.venv/bin/python`
   - Conda: run `conda activate 07_Deep_Agents` then `which python` and use that path.

---

If the kernel still doesn’t show after Option A or B: **Cursor** → **Developer: Reload Window**, then try selecting the kernel again.
