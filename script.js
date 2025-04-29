document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const memberListContainer = document.getElementById('member-list-container');
    const deleteAllBtn = document.getElementById('delete-all-btn');

    // Input fields
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const birthDateInput = document.getElementById('birth-date');
    const addressInput = document.getElementById('address');

    // Error message elements
    const fullNameError = document.getElementById('full-name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const genderError = document.getElementById('gender-error');
    const birthDateError = document.getElementById('birth-date-error');
    const addressError = document.getElementById('address-error');

    // --- Validation Functions ---

    const showError = (inputElement, errorElement, message) => {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('input-error');
    };

    const clearError = (inputElement, errorElement) => {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.classList.remove('input-error');
    };

    const validateEmail = (email) => {
        // Simple regex for email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        // Simple validation: only digits, maybe length check (e.g., 10-13 digits)
        const re = /^\d{10,13}$/; // Adjust regex as needed based on PRD refinement
        return re.test(String(phone));
    };

    const validateForm = () => {
        let isValid = true;

        // Clear previous errors
        clearError(fullNameInput, fullNameError);
        clearError(emailInput, emailError);
        clearError(phoneInput, phoneError);
        genderError.textContent = ''; // Special handling for radio group error
        genderError.style.display = 'none';
        document.querySelectorAll('input[name="gender"]').forEach(radio => radio.classList.remove('input-error')); // Clear radio highlight
        clearError(birthDateInput, birthDateError);
        clearError(addressInput, addressError);


        // Validate Full Name
        if (fullNameInput.value.trim() === '') {
            showError(fullNameInput, fullNameError, 'Nama Lengkap wajib diisi.');
            isValid = false;
        }

        // Validate Email
        if (emailInput.value.trim() === '') {
            showError(emailInput, emailError, 'Email wajib diisi.');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Format Email tidak valid.');
            isValid = false;
        }

        // Validate Phone
        if (phoneInput.value.trim() === '') {
            showError(phoneInput, phoneError, 'Nomor HP wajib diisi.');
            isValid = false;
        } else if (!validatePhone(phoneInput.value.trim())) {
            // Update this message based on final phone validation rules
            showError(phoneInput, phoneError, 'Format Nomor HP tidak valid (hanya angka, 10-13 digit).');
            isValid = false;
        }

        // Validate Gender
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        if (!selectedGender) {
            genderError.textContent = 'Gender wajib dipilih.';
            genderError.style.display = 'block';
            // Optionally highlight the radio group area or labels
            document.querySelectorAll('input[name="gender"]').forEach(radio => radio.classList.add('input-error'));
            isValid = false;
        }

        // Validate Birth Date
        if (birthDateInput.value === '') {
            showError(birthDateInput, birthDateError, 'Tanggal Lahir wajib diisi.');
            isValid = false;
        }

        // Validate Address
        if (addressInput.value.trim() === '') {
            showError(addressInput, addressError, 'Alamat wajib diisi.');
            isValid = false;
        }

        return isValid;
    };

    // --- localStorage Functions ---

    const getMembers = () => {
        return JSON.parse(localStorage.getItem('members')) || [];
    };

    const saveMembers = (members) => {
        localStorage.setItem('members', JSON.stringify(members));
    };

    // --- Display Members Function ---

    const displayMembers = () => {
        const members = getMembers();
        memberListContainer.innerHTML = ''; // Clear current list

        if (members.length === 0) {
            memberListContainer.innerHTML = '<p>Belum ada member yang terdaftar.</p>';
            deleteAllBtn.style.display = 'none'; // Hide delete all if no members
            return;
        }

        deleteAllBtn.style.display = 'inline-block'; // Show delete all button

        const grid = document.createElement('div');
        grid.className = 'member-card-grid'; // Use grid for layout

        members.forEach((member, index) => {
            const card = document.createElement('div');
            card.className = 'member-card';
            card.innerHTML = `
                <h3>${member.fullName}</h3>
                <p><strong>Email:</strong> ${member.email}</p>
                <p><strong>No. HP:</strong> ${member.phone}</p>
                <p><strong>Gender:</strong> ${member.gender}</p>
                <p><strong>Tgl Lahir:</strong> ${member.birthDate}</p>
                <p><strong>Alamat:</strong> ${member.address}</p>
                <button class="delete-btn" data-index="${index}">X</button>
            `;
            grid.appendChild(card);
        });
        memberListContainer.appendChild(grid);

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteMember);
        });
    };

    // --- Event Handlers ---

    const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission

        if (validateForm()) {
            const members = getMembers();
            const newMember = {
                id: Date.now(), // Simple unique ID using timestamp
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                gender: document.querySelector('input[name="gender"]:checked').value,
                birthDate: birthDateInput.value,
                address: addressInput.value.trim()
            };

            members.push(newMember);
            saveMembers(members);

            alert('Pendaftaran Berhasil!'); // Simple confirmation
            form.reset(); // Clear the form
            displayMembers(); // Update the displayed list
        }
    };

    const handleDeleteMember = (event) => {
        const indexToDelete = parseInt(event.target.getAttribute('data-index'), 10);
        let members = getMembers();

        if (confirm(`Yakin ingin menghapus member ${members[indexToDelete].fullName}?`)) {
            members.splice(indexToDelete, 1); // Remove member from array
            saveMembers(members);
            displayMembers(); // Refresh the list
        }
    };

    const handleDeleteAllMembers = () => {
        if (confirm('Yakin ingin menghapus SEMUA data member? Aksi ini tidak dapat dibatalkan.')) {
            saveMembers([]); // Save an empty array
            displayMembers(); // Refresh the list
        }
    };

    // --- Initial Setup ---
    form.addEventListener('submit', handleFormSubmit);
    deleteAllBtn.addEventListener('click', handleDeleteAllMembers);
    displayMembers(); // Display members on initial page load
});
