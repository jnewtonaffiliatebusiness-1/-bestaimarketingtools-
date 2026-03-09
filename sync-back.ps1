$src = 'C:\nextsite'
$dst = 'E:\Ignition w- JeanLuc\best-ai-marketing-tools'
$exclude = @('node_modules', '.next', 'sync-back.ps1', 'copy-project.ps1', 'npm-install.log', 'build-output.txt')

Get-ChildItem $src | Where-Object { $exclude -notcontains $_.Name } | ForEach-Object {
    if ($_.PSIsContainer) {
        $destPath = Join-Path $dst $_.Name
        if (Test-Path $destPath) {
            Remove-Item $destPath -Recurse -Force -ErrorAction SilentlyContinue
        }
        Copy-Item -Path $_.FullName -Destination $dst -Recurse -Force
    } else {
        Copy-Item -Path $_.FullName -Destination $dst -Force
    }
}

Write-Output "Sync complete"
