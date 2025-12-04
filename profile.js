const tg = window.Telegram.WebApp;
tg.expand();
tg.BackButton.show();

let currentStep = 1;
const totalSteps = 4;

let profileData = {
    basic: {
        age: "",
        occupation: ""
    },
    emotionalState: {
        anxiety: 0,
        mood: 0,
        stress: 0
    },
    topics: [],
    strengths: [],
    copingStyle: "",
    personalityTraits: []
};

const TOPICS = [
    "Тревога и беспокойство", "Депрессивные состояния", "Стресс на работе/учебе",
    "Проблемы в отношениях", "Низкая самооценка", "Прокрастинация",
    "Одиночество", "Гнев и раздражительность", "Проблемы со сном",
    "Панические атаки", "Травматический опыт", "Поиск смысла жизни"
];

const STRENGTHS = [
    "Эмпатия", "Упорство", "Креативность", "Аналитическое мышление",
    "Честность", "Ответственность", "Оптимизм", "Самоконтроль",
    "Адаптивность", "Лидерство", "Доброта", "Чувство юмора"
];

function init() {
    renderScales();
    renderChips();
    updateProgress();
    
    tg.BackButton.onClick(() => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        } else {
            tg.close();
        }
    });
    
    document.getElementById('prevBtn').addEventListener('click', () => {
        goToStep(currentStep - 1);
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                goToStep(currentStep + 1);
            } else {
                saveProfile();
            }
        }
    });
    
    document.getElementById('age').addEventListener('change', (e) => {
        profileData.basic.age = e.target.value;
    });
    
    document.getElementById('occupation').addEventListener('change', (e) => {
        profileData.basic.occupation = e.target.value;
    });
}

function renderScales() {
    for (let i = 1; i <= 10; i++) {
        const anxietyDiv = document.createElement('div');
        anxietyDiv.className = 'scale-item';
        anxietyDiv.innerHTML = `
            <div class="scale-number" data-scale="anxiety" data-value="${i}">${i}</div>
            <small>${i}</small>
        `;
        document.getElementById('anxietyScale').appendChild(anxietyDiv);
        
        const moodDiv = anxietyDiv.cloneNode(true);
        moodDiv.querySelector('.scale-number').dataset.scale = 'mood';
        document.getElementById('moodScale').appendChild(moodDiv);
        
        const stressDiv = anxietyDiv.cloneNode(true);
        stressDiv.querySelector('.scale-number').dataset.scale = 'stress';
        document.getElementById('stressScale').appendChild(stressDiv);
    }
    
    document.querySelectorAll('.scale-number').forEach(el => {
        el.addEventListener('click', function() {
            const scale = this.dataset.scale;
            const value = parseInt(this.dataset.value);
            
            document.querySelectorAll(`[data-scale="${scale}"]`).forEach(item => {
                item.classList.remove('selected');
            });
            
            this.classList.add('selected');
            
            profileData.emotionalState[scale] = value;
        });
    });
}

function renderChips() {
    const topicsContainer = document.getElementById('topicsChips');
    TOPICS.forEach(topic => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = topic;
        chip.addEventListener('click', function() {
            this.classList.toggle('selected');
            const index = profileData.topics.indexOf(topic);
            if (index === -1) {
                profileData.topics.push(topic);
            } else {
                profileData.topics.splice(index, 1);
            }
        });
        topicsContainer.appendChild(chip);
    });
    
    const strengthsContainer = document.getElementById('strengthsChips');
    STRENGTHS.forEach(strength => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = strength;
        chip.addEventListener('click', function() {
            this.classList.toggle('selected');
            const index = profileData.strengths.indexOf(strength);
            if (index === -1) {
                profileData.strengths.push(strength);
            } else {
                profileData.strengths.splice(index, 1);
            }
        });
        strengthsContainer.appendChild(chip);
    });
}

function goToStep(step) {
    document.getElementById(`step${currentStep}`).style.display = 'none';
    
    document.getElementById(`step${step}`).style.display = 'block';
    
    document.getElementById('prevBtn').style.display = step > 1 ? 'block' : 'none';
    document.getElementById('nextBtn').textContent = step === totalSteps ? 'Завершить' : 'Далее';
    
    currentStep = step;
    updateProgress();
    
    if (step === 1) {
        tg.BackButton.show();
    }
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function validateStep(step) {
    switch(step) {
        case 1:
            if (!profileData.basic.age || !profileData.basic.occupation) {
                tg.showAlert('Пожалуйста, заполните все поля');
                return false;
            }
            return true;
            
        case 2:
            if (!profileData.emotionalState.anxiety || 
                !profileData.emotionalState.mood || 
                !profileData.emotionalState.stress) {
                tg.showAlert('Пожалуйста, оцените все показатели');
                return false;
            }
            return true;
            
        case 3:
            if (profileData.topics.length === 0) {
                tg.showAlert('Выберите хотя бы одну тему для работы');
                return false;
            }
            return true;
            
        case 4:
            if (profileData.strengths.length === 0) {
                tg.showAlert('Выберите хотя бы одну сильную сторону');
                return false;
            }
            return true;
            
        default:
            return true;
    }
}

function saveProfile() 
{
    if (profileData.emotionalState.anxiety >= 7) 
        {
        profileData.copingStyle = "Избегающий";
    } else if (profileData.emotionalState.stress >= 7) 
        {
        profileData.copingStyle = "Контролирующий";
    }
     else 
        {
        profileData.copingStyle = "Адаптивный";
    }
    
    localStorage.setItem('psychologicalProfile', JSON.stringify(profileData));
    
    tg.sendData(JSON.stringify({
        type: 'psychological_profile',
        data: profileData
    }));
    
    tg.showAlert('✅ Психологический профиль создан!', () => {
        tg.close();
    });
}

document.addEventListener('DOMContentLoaded', init);