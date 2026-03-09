$src = 'E:\Ignition w- JeanLuc\best-ai-marketing-tools'
$dst = 'C:\nextsite'
$exclude = @('node_modules', '.next', 'build-output.txt', 'npm-install.log', 'copy-project.ps1')

Get-ChildItem $src | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    if ($_.PSIsContainer) {
        Copy-Item -Path $_.FullName -Destination $dst -Recurse -Force
    } else {
        Copy-Item -Path $_.FullName -Destination $dst -Force
    }
}

Write-Output "Copy complete. Files in destination:"
(Get-ChildItem $dst).Name
