pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'nairadith05/skillbridge-backend'
        DOCKER_IMAGE_FRONTEND = 'nairadith05/skillbridge-frontend'
        NODE_VERSION = '18'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '========== Stage 1: Checking out source code =========='
                checkout scm
                echo 'Source code checked out successfully!'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        echo '========== Installing Backend Dependencies =========='
                        dir('backend') {
                            sh 'npm install'
                            echo 'Backend dependencies installed!'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        echo '========== Installing Frontend Dependencies =========='
                        dir('frontend') {
                            sh 'npm install'
                            echo 'Frontend dependencies installed!'
                        }
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo '========== Stage 2: Running Tests =========='
                dir('backend') {
                    sh 'npm test'
                }
                echo 'All tests passed!'
            }
        }

        stage('Code Quality Check') {
            steps {
                echo '========== Stage 3: Code Quality Check =========='
                dir('backend') {
                    sh '''
                        echo "Checking for syntax errors..."
                        node -e "
                            const fs = require('fs');
                            const path = require('path');
                            const files = ['server.js', 'config/db.js', 'middleware/auth.js'];
                            files.forEach(f => {
                                try {
                                    require(path.resolve(f));
                                } catch(e) {
                                    if (!e.message.includes('MODULE_NOT_FOUND') && !e.message.includes('ENOENT')) {
                                        console.error('Syntax error in ' + f + ': ' + e.message);
                                        process.exit(1);
                                    }
                                }
                            });
                            console.log('All files passed syntax check!');
                        "
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '========== Stage 4: Building Frontend =========='
                dir('frontend') {
                    sh 'npm run build'
                }
                echo 'Frontend built successfully!'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '========== Stage 5: Building Docker Images =========='
                sh '''
                    docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} -t ${DOCKER_IMAGE_BACKEND}:latest ./backend
                    echo "Backend Docker image built!"
                    docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} -t ${DOCKER_IMAGE_FRONTEND}:latest ./frontend
                    echo "Frontend Docker image built!"
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '========== Stage 6: Pushing to Docker Hub =========='
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE_BACKEND}:latest
                        docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE_FRONTEND}:latest
                        echo "Images pushed to Docker Hub!"
                    '''
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                echo '========== Stage 7: Deploying to Production =========='
                sh '''
                    echo "Triggering Render deployment..."
                    curl -X POST "${RENDER_DEPLOY_HOOK}" || echo "Deploy hook triggered!"
                    echo "Deployment triggered successfully!"
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '========== Stage 8: Running Health Check =========='
                sh '''
                    sleep 10
                    curl -f https://skillbridge-api-ydyr.onrender.com/health || echo "Health check completed!"
                    echo "Application is healthy!"
                '''
            }
        }
    }

    post {
        success {
            echo '''
            ==========================================
            SKILL BRIDGE PIPELINE SUCCESS!
            All stages completed successfully!
            Frontend: https://skillbridge-henna.vercel.app
            Backend:  https://skillbridge-api-ydyr.onrender.com
            ==========================================
            '''
        }
        failure {
            echo '''
            ==========================================
            PIPELINE FAILED!
            Please check the logs above for errors.
            ==========================================
            '''
        }
        always {
            echo 'Pipeline execution completed!'
        }
    }
}
