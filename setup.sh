#!/bin/bash

echo "🚀 Configurando PS API DeMarco..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📄 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado! Por favor, configure suas variáveis de ambiente."
else
    echo "✅ Arquivo .env já existe."
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "Para iniciar o ambiente de desenvolvimento:"
echo "  npm run docker:dev"
echo ""
echo "Para iniciar o ambiente de produção:"
echo "  npm run docker:prod"
echo ""
echo "A API estará disponível em: http://localhost:3000"
echo "Mongo Express estará disponível em: http://localhost:8081"
echo ""
echo "Para mais informações, consulte o README.md"
