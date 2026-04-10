#!/bin/bash
# ============================================
# Skill Bridge - AWS EC2 Deployment Script
# ============================================

echo "Starting Skill Bridge deployment on AWS EC2..."

# Update system
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install nginx
sudo apt-get install -y nginx

# Install PM2 for process management
sudo npm install -g pm2

# Clone repository
git clone https://github.com/AdithNair03/skillbridge.git
cd skillbridge

# Setup environment variables
cat > backend/.env << ENVEOF
PORT=5000
MONGO_URI=mongodb+srv://skilluser:skill1234@cluster0.afm564x.mongodb.net/skillbridge?appName=Cluster0
JWT_SECRET=skillbridge2024secretkey
NODE_ENV=production
CLIENT_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
ENVEOF

# Install and start backend
cd backend
npm install
pm2 start server.js --name "skillbridge-backend"
pm2 startup
pm2 save

# Build and serve frontend
cd ../frontend
npm install
echo "VITE_API_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000/api" > .env
npm run build

# Configure nginx
sudo tee /etc/nginx/sites-available/skillbridge << NGINXEOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root /home/ubuntu/skillbridge/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/skillbridge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "============================================"
echo "Skill Bridge deployed successfully on AWS EC2!"
echo "Access at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "============================================"
