# Script de configuração de ambiente
# Execute: .\setup-env.ps1

Write-Host "🚀 Configurando ambiente..." -ForegroundColor Green

# Configurar variáveis de ambiente
$env:DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/app?schema=public'
$env:JWT_SECRET = ''
$env:PORT = '3000'

Write-Host "✅ Variáveis de ambiente configuradas:" -ForegroundColor Green
Write-Host "   DATABASE_URL: $env:DATABASE_URL" -ForegroundColor Cyan
Write-Host "   JWT_SECRET: $env:JWT_SECRET" -ForegroundColor Cyan
Write-Host "   PORT: $env:PORT" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Para aplicar em todas as sessões, adicione ao seu perfil:" -ForegroundColor Yellow
Write-Host "   notepad `$PROFILE" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Próximos passos:" -ForegroundColor Green
Write-Host "   1. docker compose up -d" -ForegroundColor White
Write-Host "   2. pnpm prisma migrate dev" -ForegroundColor White
Write-Host "   3. pnpm start:dev" -ForegroundColor White

