param(
  [Parameter(Mandatory = $true)]
  [string]$ConnectionString,

  [Parameter(Mandatory = $false)]
  [string]$BackupPath = (Join-Path $PSScriptRoot '..\output\db_cluster_backup.full.sql')
)

$ErrorActionPreference = 'Stop'

$resolvedBackupPath = (Resolve-Path $BackupPath).Path

if (-not (Test-Path $resolvedBackupPath -PathType Leaf)) {
  throw "Backup file not found: $BackupPath"
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker is required to run the restore."
}

$backupDir = Split-Path $resolvedBackupPath -Parent
$backupFile = Split-Path $resolvedBackupPath -Leaf

Write-Host "Restoring backup file: $resolvedBackupPath"
Write-Host "Using Docker image: postgres:17"

$dockerArgs = @(
  'run',
  '--rm',
  '--volume', "${backupDir}:/backup",
  'postgres:17',
  'psql',
  '-d', $ConnectionString,
  '-f', "/backup/$backupFile"
)

& docker @dockerArgs
$exitCode = $LASTEXITCODE

if ($exitCode -ne 0) {
  throw "Restore failed with exit code $exitCode"
}

Write-Host 'Restore command finished.'
