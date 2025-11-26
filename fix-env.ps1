# Fix GitHub Pages Environment to Allow All Branches
$token = gh auth token
$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

$body = @{
    deployment_branch_policy = $null
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/ozlphrt/shopping-list/environments/github-pages" -Method PUT -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "✓ Environment updated successfully!" -ForegroundColor Green
    Write-Host "Deployment branch policy removed - all branches can now deploy"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}


