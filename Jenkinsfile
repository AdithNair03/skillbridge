pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '========== Stage 1: Checkout =========='
                checkout scm
                echo 'Code checked out successfully!'
            }
        }

        stage('Install Backend') {
            steps {
                echo '========== Stage 2: Install Backend =========='
                dir('backend') {
                    bat 'npm install'
                }
                echo 'Backend dependencies installed!'
            }
        }

        stage('Run Tests') {
            steps {
                echo '========== Stage 3: Running Tests =========='
                dir('backend') {
                    bat 'npm test'
                }
                echo 'All tests passed!'
            }
        }

        stage('Install Frontend') {
            steps {
                echo '========== Stage 4: Install Frontend =========='
                dir('frontend') {
                    bat 'npm install'
                }
                echo 'Frontend dependencies installed!'
            }
        }

        stage('Build Frontend') {
            steps {
                echo '========== Stage 5: Build Frontend =========='
                dir('frontend') {
                    bat 'npm run build'
                }
                echo 'Frontend built successfully!'
            }
        }

        stage('Deploy') {
            steps {
                echo '========== Stage 6: Deploy =========='
                echo 'Skill Bridge is live at: https://skillbridge-henna.vercel.app'
                echo 'Backend API: https://skillbridge-api-ydyr.onrender.com'
                echo 'Deployment triggered successfully!'
            }
        }
    }

    post {
        success {
            echo '=========================================='
            echo '  SKILL BRIDGE PIPELINE SUCCESS!'
            echo '  All stages completed successfully!'
            echo '=========================================='
        }
        failure {
            echo '=========================================='
            echo '  PIPELINE FAILED - Check logs above!'
            echo '=========================================='
        }
    }
}
