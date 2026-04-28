/* ============================================================
   PORTAL JAVASCRIPT - Multi-Step Form & Submission
   ============================================================ */

const form = document.getElementById('applicationForm');
const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
let currentStep = 1;

// Step Navigation
function showStep(stepNumber) {
    steps.forEach(step => step.classList.remove('active'));
    progressSteps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.getAttribute('data-step')) < stepNumber) {
            step.classList.add('completed');
        }
    });

    const activeStep = document.getElementById(`step${stepNumber}`);
    if (activeStep) {
        activeStep.classList.add('active');
        progressSteps[stepNumber - 1].classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(stepNumber) {
    if (validateStep(stepNumber)) {
        currentStep = stepNumber + 1;
        showStep(currentStep);
    }
}

function prevStep(stepNumber) {
    currentStep = stepNumber - 1;
    showStep(currentStep);
}

// Form Validation
function validateStep(stepNumber) {
    const step = document.getElementById(`step${stepNumber}`);
    const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    if (!value) {
        formGroup.classList.add('error');
        errorElement.textContent = 'هذا الحقل مطلوب';
        return false;
    }

    // Specific validations
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            formGroup.classList.add('error');
            errorElement.textContent = 'البريد الإلكتروني غير صحيح';
            return false;
        }
    }

    if (field.name === 'phone' && value) {
        const phoneRegex = /^(\+966|0)[0-9]{9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            formGroup.classList.add('error');
            errorElement.textContent = 'رقم الهاتف غير صحيح';
            return false;
        }
    }

    if (field.name === 'iban' && value) {
        const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
        if (!ibanRegex.test(value.replace(/\s/g, ''))) {
            formGroup.classList.add('error');
            errorElement.textContent = 'رقم الآيبان غير صحيح';
            return false;
        }
    }

    if (field.name === 'monthlyIncome' || field.name === 'requestAmount') {
        if (parseInt(value) < 0) {
            formGroup.classList.add('error');
            errorElement.textContent = 'المبلغ يجب أن يكون موجب';
            return false;
        }
    }

    if (field.name === 'children') {
        if (parseInt(value) < 0 || parseInt(value) > 20) {
            formGroup.classList.add('error');
            errorElement.textContent = 'عدد الأطفال غير صحيح';
            return false;
        }
    }

    formGroup.classList.remove('error');
    errorElement.textContent = '';
    return true;
}

// Real-time validation on input
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => {
        validateField(field);
    });

    field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('error')) {
            validateField(field);
        }
    });
});

// File Upload Handling
function setupFileUpload(uploadAreaId, inputId) {
    const uploadArea = document.getElementById(uploadAreaId);
    const input = document.getElementById(inputId);
    const previewArea = document.getElementById(uploadAreaId.replace('Area', 'Preview'));

    if (!uploadArea || !input) return;

    // Click to upload
    uploadArea.addEventListener('click', () => input.click());

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(197, 160, 89, 0.1)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = 'rgba(197, 160, 89, 0.02)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(197, 160, 89, 0.02)';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            handleFileUpload(input, previewArea);
        }
    });

    // File input change
    input.addEventListener('change', () => {
        handleFileUpload(input, previewArea);
    });
}

function handleFileUpload(input, previewArea) {
    const file = input.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showError(input, 'صيغة الملف غير مدعومة. استخدم JPG, PNG أو PDF');
        input.value = '';
        return;
    }

    // Validate file size
    if (file.size > maxSize) {
        showError(input, 'حجم الملف يتجاوز 5 MB');
        input.value = '';
        return;
    }

    // Clear error
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    formGroup.classList.remove('error');
    errorElement.textContent = '';

    // Show preview
    previewArea.innerHTML = '';
    previewArea.classList.add('show');

    const preview = document.createElement('div');
    preview.className = 'file-preview-item';

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '5px';
            preview.appendChild(img);
            preview.innerHTML += `<span>${file.name}</span>`;
            preview.innerHTML += '<span class="remove" onclick="removeFile(this)">✕ حذف</span>';
            previewArea.appendChild(preview);
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = `
            <i class="fas fa-file-pdf"></i>
            <span>${file.name}</span>
            <span class="remove" onclick="removeFile(this)">✕ حذف</span>
        `;
        previewArea.appendChild(preview);
    }
}

function removeFile(element) {
    const preview = element.closest('.file-preview');
    const input = preview.previousElementSibling.querySelector('input[type="file"]');
    input.value = '';
    preview.classList.remove('show');
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    formGroup.classList.add('error');
    errorElement.textContent = message;
}

// Setup file uploads
setupFileUpload('idFrontArea', 'idFront');
setupFileUpload('idBackArea', 'idBack');

// Generate Transaction Number
function generateTransactionNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `WA-${year}-${random}`;
}

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Final validation for last step
    if (!validateStep(5)) {
        return;
    }

    // Check terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        const formGroup = termsCheckbox.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        formGroup.classList.add('error');
        errorElement.textContent = 'يجب الموافقة على الشروط والأحكام';
        return;
    }

    // Generate transaction number
    const transactionNumber = generateTransactionNumber();

    // Show success modal
    const modal = document.getElementById('successModal');
    const transactionDisplay = document.getElementById('transactionNumber');
    transactionDisplay.textContent = transactionNumber;
    modal.classList.add('show');

    // Store form data (in real app, send to server)
    const formData = new FormData(form);
    const data = {
        transactionNumber,
        timestamp: new Date().toISOString(),
        ...Object.fromEntries(formData.entries())
    };

    console.log('Application Data:', data);

    // Redirect to WhatsApp after 3 seconds
    setTimeout(() => {
        const phoneNumber = '+966545239928';
        const message = `السلام عليكم ورحمة الله وبركاته\n\nلقد قمت بتقديم طلب دعم\n\nرقم المعاملة: ${transactionNumber}\n\nجاري معالجة طلبك قريباً.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');

        // Reset form after redirect
        setTimeout(() => {
            form.reset();
            modal.classList.remove('show');
            currentStep = 1;
            showStep(1);
        }, 1000);
    }, 3000);
});

// Initial setup
showStep(1);

// Prevent form submission on enter key (except textarea)
form.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// Auto-format phone number
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('966')) {
            value = '0' + value.slice(3);
        }
        if (!value.startsWith('0')) {
            value = '0' + value;
        }
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });
}

// Auto-format IBAN
const ibanInput = document.getElementById('iban');
if (ibanInput) {
    ibanInput.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase().replace(/\s/g, '');
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        e.target.value = formatted;
    });
}

// Format currency input
const incomeInput = document.getElementById('monthlyIncome');
const amountInput = document.getElementById('requestAmount');

function formatCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    input.value = value ? parseInt(value).toLocaleString('ar-SA') : '';
}

if (incomeInput) {
    incomeInput.addEventListener('blur', () => formatCurrency(incomeInput));
}

if (amountInput) {
    amountInput.addEventListener('blur', () => formatCurrency(amountInput));
}

// Prevent negative numbers
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === '-' || e.key === '+') {
            e.preventDefault();
        }
    });
});
