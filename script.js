const table = document.getElementById('lifeTable');
const rows = 90; // anos de vida
const cols = 52; // semanas por ano

// Obter data de nascimento e semanas vividas
const birthDate = getBirthDate();
const weeksLived = getWeeksLived(birthDate);
const age = getAge(birthDate);
const daysLived = getDaysLived(birthDate);
const daysUntilBirthday = getDaysUntilNextBirthday(birthDate);
const birthWeek = getBirthWeek(birthDate);
const currentLifeWeek = getCurrentLifeWeek(birthDate);

// Calcular e exibir porcentagem de vida vivida
const totalWeeks = rows * cols;
const percentageLived = Math.min((weeksLived / totalWeeks) * 100, 100);

// Atualizar estatísticas
document.getElementById('age').textContent = age + ' anos';
document.getElementById('nextBirthday').textContent = '• Seu próximo aniversário será daqui a ' + getTimeUntilNextBirthday(birthDate);
document.getElementById('daysLived').textContent = daysLived.toLocaleString() + ' dias';
document.getElementById('weeksLived').textContent = weeksLived.toLocaleString() + ' semanas';
document.getElementById('progressText').textContent = 'Você já viveu ' + percentageLived.toFixed(2) + '% da sua vida';

const progressBar = document.getElementById('progressBar');
progressBar.style.width = percentageLived + '%';
progressBar.textContent = Math.round(percentageLived) + '%';

// Criar tabela
const tbody = document.createElement('tbody');
tbody.style.setProperty('--cols', cols);
let weekCount = 0;
let weeksToPaint = weeksLived;

for (let row = 1; row <= rows; row++) {
    const tr = document.createElement('tr');
    for (let col = 1; col <= cols; col++) {
        const td = document.createElement('td');
        td.title = `Ano ${row}, Semana ${col}`;

        // Destacar semana de nascimento
        if (row === 1 && col === birthWeek) {
            td.style.background = '#4a90e2'; // Azul para nascimento
            td.style.borderColor = '#357abd';
            td.title = `NASCIMENTO - Ano ${row}, Semana ${col}`;
        }
        // Destacar semanas vividas (começando da semana de nascimento)
        else if (weekCount >= birthWeek - 1 && weeksToPaint > 0) {
            td.style.background = '#999999'; // Verde para semanas vividas
            td.style.borderColor = 'transparent';
            weeksToPaint--;
        }

        if ((row-1) % 5 === 0 && col === 1) {
            td.classList.add('year-marker');
            td.setAttribute('age', row-1);
        }

        tr.appendChild(td);
        weekCount++;
    }

    tbody.appendChild(tr);
}
table.appendChild(tbody);


// Função para obter ou perguntar a data de nascimento
function getBirthDate() {
    let birthDate = localStorage.getItem('birthDate');
    if (!birthDate) {
        birthDate = prompt('Qual sua data de nascimento? (formato: DD/MM/AAAA)');
        // Validação simples
        if (birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
            localStorage.setItem('birthDate', birthDate);
        } else {
            alert('Data inválida. Tente novamente.');
            return getBirthDate();
        }
    }
    // Converter formato DD/MM/AAAA para objeto Date
    const parts = birthDate.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Função para calcular semanas vividas
function getWeeksLived(birthDate) {
    const now = new Date();
    const diffMs = now - birthDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
}

// Função para calcular idade em anos
function getAge(birthDate) {
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Função para calcular dias vividos
function getDaysLived(birthDate) {
    const now = new Date();
    const diffMs = now - birthDate;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// Função para calcular dias até o próximo aniversário
function getDaysUntilNextBirthday(birthDate) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Próximo aniversário no ano atual
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

    // Se já passou este ano, calcular para o próximo ano
    if (nextBirthday < now) {
        nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }

    const diffMs = nextBirthday - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Função para calcular meses e dias até o próximo aniversário
function getTimeUntilNextBirthday(birthDate) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Próximo aniversário no ano atual
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

    // Se já passou este ano, calcular para o próximo ano
    if (nextBirthday < now) {
        nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }

    const diffMs = nextBirthday - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Calcular meses e dias
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;

    if (months > 0) {
        if (remainingDays > 0) {
            return `${months} ${months === 1 ? 'mês' : 'meses'} e ${remainingDays} ${remainingDays === 1 ? 'dia' : 'dias'}`;
        } else {
            return `${months} ${months === 1 ? 'mês' : 'meses'}`;
        }
    } else {
        return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    }
}

// Função para calcular em qual semana do ano o usuário nasceu
function getBirthWeek(birthDate) {
    const startOfYear = new Date(birthDate.getFullYear(), 0, 1);
    const diffMs = birthDate - startOfYear;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.ceil((diffDays + 1) / 7);
}

// Função para calcular em qual semana do ano atual estamos
function getCurrentWeek() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const diffMs = now - startOfYear;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.ceil((diffDays + 1) / 7);
}

// Função para calcular em qual semana da vida estamos atualmente
function getCurrentLifeWeek(birthDate) {
    const now = new Date();
    const diffMs = now - birthDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
}
