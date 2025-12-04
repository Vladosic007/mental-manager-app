const tg = window.Telegram.WebApp;
tg.expand(); 
tg.BackButton.hide();

const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const profileCard = document.getElementById('profileCard');
const createProfileBtn = document.getElementById('createProfileBtn');
const profileBtn = document.getElementById('profileBtn');

let psychologicalProfile = null;
let messages = [
    {
        text: "Привет! Я Mental Manager. Давай создадим твой психологический профиль для более персонализированной помощи.",
        isUser: false
    }
];

function init() 
{
    renderMessages();
    
    const savedProfile = localStorage.getItem('psychologicalProfile');
    if (savedProfile) {
        psychologicalProfile = JSON.parse(savedProfile);
        profileCard.style.display = 'none';
        addMessage("У вас уже есть созданный психологический профиль. Хотите его обновить?", false);
    }
    
    messageInput.addEventListener('input', autoResize);
    
    messageInput.addEventListener('keydown', (e) => 
        {
        if (e.key === 'Enter' && !e.shiftKey) 
            {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
    
    createProfileBtn.addEventListener('click', () => 
        {
        tg.openInvoice('profile_assessment');
    });
    
    profileBtn.addEventListener('click', () => 
        {
        if (psychologicalProfile) 
            {
            showProfileSummary();
        } else {
            tg.showAlert('Сначала создайте психологический профиль');
        }
    });
}

function autoResize() 
{
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}

function addMessage(text, isUser = false) 
{
    messages.push({ text, isUser });
    renderMessages();
    scrollToBottom();
}

function renderMessages() 
{
    chatContainer.innerHTML = '';
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.isUser ? 'user-message' : 'bot-message'}`;
        
        messageDiv.innerHTML = `
            <div class="avatar">${msg.isUser ? '👤' : '🤖'}</div>
            <div class="content">${msg.text}</div>
        `;
        
        chatContainer.appendChild(messageDiv);
    });
}

function scrollToBottom() 
{
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() 
{
    const text = messageInput.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    messageInput.value = '';
    autoResize.call(messageInput);
    
    setTimeout(() => 
        {
        const responses = [
            "Понимаю. Расскажи подробнее об этой ситуации.",
            "Интересно. Как это влияет на твою повседневную жизнь?",
            "Давай разберем это вместе. Что именно вызывает сложности?",
            "Спасибо, что делишься. Как давно ты это замечаешь?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, false);
    }, 1000);
}

function showProfileSummary() 
{
    const summary = `
        <div class="message bot-message">
            <div class="avatar">📊</div>
            <div class="content">
                <strong>Ваш психологический профиль:</strong><br><br>
                <strong>Возраст:</strong> ${psychologicalProfile.basic.age}<br>
                <strong>Основные темы:</strong> ${psychologicalProfile.topics.join(', ')}<br>
                <strong>Сильные стороны:</strong> ${psychologicalProfile.strengths.join(', ')}<br>
                <strong>Стиль совладания:</strong> ${psychologicalProfile.copingStyle}
            </div>
        </div>
    `;
    
    chatContainer.innerHTML += summary;
    scrollToBottom();
}

document.addEventListener('DOMContentLoaded', init);

tg.onEvent('invoiceClosed', (event) => 
    {
    if (event.status === 'paid') 
        {
        window.location.href = 'profile.html';
    }
});

function sendDataToBot(data) 
{
    tg.sendData(JSON.stringify(data));
}