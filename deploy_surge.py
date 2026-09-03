import subprocess

cmd = "npx surge ./ spendpulse-dashboard-live.surge.sh"
p = subprocess.Popen(cmd, shell=True, cwd=r"C:\Users\lenovo\.gemini\antigravity-ide\scratch\expense-tracker", stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

out, err = p.communicate(input="spendpulse_live_app@mail.com\nSpendPulse123!\nSpendPulse123!\n\n\n")
print("STDOUT:", out)
print("STDERR:", err)
