\
Param(
  [Parameter(Mandatory=$true)]
  [string]$Repo
)

git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin "https://github.com/$Repo.git"
git push -u origin main

# Atualiza badges do README
(Get-Content README.md).replace('USER/REPO', $Repo) | Set-Content README.md

Write-Output "✅ Repo $Repo enviado. Atualizei os badges no README."
