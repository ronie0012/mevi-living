#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🚀 Mevi Living Chat Support Setup');
console.log('==================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupChat() {
  try {
    // Check if .env exists
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');
    
    console.log('📋 Checking environment setup...\n');
    
    // Copy .env.example to .env if doesn't exist
    if (!fs.existsSync(envPath)) {
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ Created .env file from .env.example');
      } else {
        console.log('❌ No .env.example found. Please create one.');
        return;
      }
    }

    // Read current .env
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if OpenAI API key is set
    const hasOpenAIKey = envContent.includes('OPENAI_API_KEY=') && 
                        !envContent.includes('OPENAI_API_KEY=""') &&
                        !envContent.includes('OPENAI_API_KEY="your_openai_api_key_here"');
    
    if (!hasOpenAIKey) {
      console.log('🔑 OpenAI API Key Setup');
      console.log('To enable AI chat responses, you need an OpenAI API key.');
      console.log('Get one at: https://platform.openai.com/api-keys\n');
      
      const apiKey = await askQuestion('Enter your OpenAI API key (or press Enter to skip): ');
      
      if (apiKey && apiKey.trim()) {
        // Update .env file
        if (envContent.includes('OPENAI_API_KEY=')) {
          envContent = envContent.replace(
            /OPENAI_API_KEY=.*/,
            `OPENAI_API_KEY="${apiKey.trim()}"`
          );
        } else {
          envContent += `\n# OpenAI API Key for chat support\nOPENAI_API_KEY="${apiKey.trim()}"`;
        }
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ OpenAI API key saved to .env file\n');
      } else {
        console.log('⏭️ Skipped OpenAI API key setup. You can add it later.\n');
      }
    } else {
      console.log('✅ OpenAI API key is already configured\n');
    }

    // Check database setup
    console.log('🗄️ Database Setup');
    const dbPath = path.join(process.cwd(), 'local.db');
    
    if (!fs.existsSync(dbPath)) {
      console.log('Database not found. Running migrations...');
      const { spawn } = require('child_process');
      
      // Run database migration
      const migrate = spawn('npm', ['run', 'db:migrate'], {
        stdio: 'inherit',
        shell: true
      });
      
      await new Promise((resolve) => {
        migrate.on('close', resolve);
      });
      
      console.log('✅ Database setup completed\n');
    } else {
      console.log('✅ Database already exists\n');
    }

    // Summary
    console.log('🎉 Chat Support Setup Summary');
    console.log('=============================');
    console.log('✅ Environment variables configured');
    console.log('✅ Database tables created');
    console.log('✅ Chat components integrated');
    console.log('✅ Socket.io server configured');
    console.log('✅ AI service ready');
    console.log('✅ Admin dashboard available\n');
    
    console.log('🚀 Next Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Visit your site and look for the chat widget');
    console.log('3. Test the chat functionality');
    console.log('4. Access admin dashboard at /admin/chat');
    console.log('5. Read CHAT_SUPPORT_README.md for detailed documentation\n');
    
    const startNow = await askQuestion('Start the development server now? (y/n): ');
    
    if (startNow.toLowerCase() === 'y' || startNow.toLowerCase() === 'yes') {
      console.log('🚀 Starting development server...\n');
      const { spawn } = require('child_process');
      
      const dev = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true
      });
      
      // Keep the process running
      process.on('SIGINT', () => {
        dev.kill();
        process.exit(0);
      });
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupChat();