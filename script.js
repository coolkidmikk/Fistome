document.addEventListener('DOMContentLoaded', function() {
  const editToggle = document.getElementById('edit-toggle');
  const addIconBtn = document.getElementById('add-icon');
  const modal = document.getElementById('icon-modal');
  const modalTitle = document.getElementById('modal-title');
  const closeIconModal = document.getElementById('close-icon-modal');
  const closeThemeModal = document.getElementById('close-theme-modal');
  const iconForm = document.getElementById('icon-form');
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  const rowSelect = document.getElementById('icon-row');
  const themeToggle = document.getElementById('theme-toggle');
  const themeModal = document.getElementById('theme-modal');
  const themeGrid = document.querySelector('.theme-grid');
  const greetingElement = document.querySelector('h1'); 

  let customBackgroundImage = null;
  
  // --- INITIAL SETUP: Change Edit Button Text ---
  // We force the button to be text instead of an icon
  if(editToggle) {
    editToggle.textContent = "Edit";
    editToggle.classList.add('text-mode'); // Add class for CSS styling
  }

  // Theme Definitions
  const themes = [
    { id: 'dark', name: 'Dark', colors: ['#282828', '#3a3a3a', '#f5c78c'] },
    { id: '8888', name: '8888', colors: ['#1e1e2e', '#313244', '#f38ba8'] },
    { id: '80s-after-dark', name: '80s After Dark', colors: ['#181818', '#ff7edb', '#ff9de6'] },
    { id: '9009', name: '9009', colors: ['#c0c0c0', '#333333', '#056652'] },
    { id: 'aether', name: 'Aether', colors: ['#101010', '#ff2e97', '#c932ff'] },
    { id: 'aurora', name: 'Aurora', colors: ['#01161F', '#3CEADC', '#1998b2'] },
    { id: 'beach', name: 'Beach', colors: ['#FFD79B', '#FF9A3C', '#604830'] },
    { id: 'blueberry-dark', name: 'Blueberry Dark', colors: ['#212B42', '#6377BD', '#9FAED6'] },
    { id: 'light', name: 'Light', colors: ['#e0e0e0', '#333333', '#d0d0d0'] },
    { id: 'dracula', name: 'Dracula', colors: ['#282a36', '#ff79c6', '#8be9fd'] },
    { id: 'nord', name: 'Nord', colors: ['#2e3440', '#88c0d0', '#5e81ac'] },
    { id: 'solarized-dark', name: 'Solarized Dark', colors: ['#002b36', '#859900', '#268bd2'] },
    { id: 'solarized-light', name: 'Solarized Light', colors: ['#fdf6e3', '#cb4b16', '#268bd2'] },
    { id: 'gruvbox', name: 'Gruvbox', colors: ['#282828', '#cc241d', '#98971a'] },
    { id: 'monokai', name: 'Monokai', colors: ['#272822', '#f92672', '#a6e22e'] },
    { id: 'tokyo-night', name: 'Tokyo Night', colors: ['#1a1b26', '#7aa2f7', '#bb9af7'] },
    { id: 'github-dark', name: 'GitHub Dark', colors: ['#0d1117', '#58a6ff', '#f0883e'] },
    { id: 'material', name: 'Material', colors: ['#263238', '#89DDFF', '#f07178'] },
    { id: 'synthwave', name: 'Synthwave', colors: ['#241b2f', '#ff7edb', '#36f9f6'] },
    { id: 'green-mint', name: 'Green Mint', colors: ['#0b2027', '#40798c', '#70a9a1'] }
  ];
  
  // Initial State
  addIconBtn.style.display = 'none';
  addIconBtn.style.opacity = '0';
  addIconBtn.style.transform = 'translateX(60px)';
  themeToggle.style.display = 'none';
  themeToggle.style.opacity = '0';
  themeToggle.style.transform = 'translateX(120px)';
  
  const MAX_ICONS_PER_ROW = 8;
  let editMode = false;
  let currentIcon = null;
  let currentTheme = 'dark';
  
  // Save Greeting Logic
  function saveGreeting() {
    if (greetingElement) {
      const text = greetingElement.innerText.trim();
      const finalText = text.length > 0 ? text : 'Welcome!';
      greetingElement.innerText = finalText;
      browser.storage.local.set({ greeting: finalText });
    }
  }

  if (greetingElement) {
    greetingElement.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        greetingElement.blur();
      }
    });
    greetingElement.addEventListener('blur', saveGreeting);
  }

  // Theme Logic
  function createThemeOptions() {
    themeGrid.innerHTML = '';
    createBackgroundImageOption();
    
    const colorThemesContainer = document.createElement('div');
    colorThemesContainer.className = 'color-themes-container';
    
    const colorThemesTitle = document.createElement('div');
    colorThemesTitle.className = 'section-title';
    colorThemesTitle.textContent = 'Color Themes';
    colorThemesContainer.appendChild(colorThemesTitle);
    themeGrid.appendChild(colorThemesContainer);
    
    themes.forEach(theme => {
      const themeOption = document.createElement('div');
      themeOption.className = 'theme-option';
      themeOption.dataset.themeId = theme.id;
      
      if (theme.id === currentTheme) themeOption.classList.add('active');
      
      const colorPreview = document.createElement('div');
      colorPreview.className = 'theme-color-preview';
      
      theme.colors.forEach(color => {
        const colorCircle = document.createElement('div');
        colorCircle.className = 'color-circle';
        colorCircle.style.backgroundColor = color;
        colorPreview.appendChild(colorCircle);
      });
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'theme-name';
      nameDiv.textContent = theme.name;
      
      themeOption.appendChild(colorPreview);
      themeOption.appendChild(nameDiv);
      
      themeOption.addEventListener('click', () => {
        if (!customBackgroundImage) {
          applyTheme(theme.id);
          document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
          themeOption.classList.add('active');
        }
      });
      
      colorThemesContainer.appendChild(themeOption);
    });
  }
  
  function createBackgroundImageOption() {
    const existingBgContainer = themeGrid.querySelector('.bg-image-container');
    if (existingBgContainer) existingBgContainer.remove();
    
    const bgImageContainer = document.createElement('div');
    bgImageContainer.className = 'bg-image-container';
    
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'Custom Background Image';
    bgImageContainer.appendChild(sectionTitle);
    
    const customFileInput = document.createElement('div');
    customFileInput.className = 'custom-file-input';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'bg-image-upload';
    fileInput.accept = 'image/*';
    
    const fileInputLabel = document.createElement('label');
    fileInputLabel.className = 'file-input-label';
    fileInputLabel.textContent = 'Choose Image';
    fileInputLabel.setAttribute('for', 'bg-image-upload');
    
    customFileInput.appendChild(fileInput);
    customFileInput.appendChild(fileInputLabel);
    
    fileInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) { applyBackgroundImage(e.target.result); };
        reader.readAsDataURL(this.files[0]);
      }
    });
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'bg-image-buttons';
    
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'bg-image-btn remove';
    removeButton.textContent = 'Remove Background';
    removeButton.addEventListener('click', removeBackgroundImage);
    
    buttonsContainer.appendChild(removeButton);
    bgImageContainer.appendChild(customFileInput);
    bgImageContainer.appendChild(buttonsContainer);
    themeGrid.insertBefore(bgImageContainer, themeGrid.firstChild);
  }
  
  function applyBackgroundImage(imageData) {
    browser.storage.local.set({ backgroundImage: imageData });
    document.body.style.backgroundImage = `url(${imageData})`;
    document.body.classList.add('has-bg-image');
    customBackgroundImage = imageData;
    
    if (currentTheme !== 'dark') {
      currentTheme = 'dark';
      document.body.classList.forEach(c => {
        if (c.startsWith('theme-')) document.body.classList.remove(c);
      });
      document.body.classList.add('theme-dark');
      browser.storage.local.set({ theme: 'dark' });
    }
    showNotification('Custom background applied.', 'info');
  }
  
  function removeBackgroundImage() {
    browser.storage.local.remove('backgroundImage');
    document.body.style.backgroundImage = '';
    document.body.classList.remove('has-bg-image');
    customBackgroundImage = null;
    showNotification(`Background image removed.`, 'info');
    createThemeOptions();
  }
  
  function applyTheme(themeId) {
    const modalContent = document.querySelector('.theme-modal-content');
    modalContent.classList.add('theme-modal-fadeout');
    
    setTimeout(() => {
      document.body.classList.forEach(c => {
        if (c.startsWith('theme-')) document.body.classList.remove(c);
      });
      document.body.classList.add(`theme-${themeId}`);
      currentTheme = themeId;
      if (customBackgroundImage) document.body.classList.add('has-bg-image');
      browser.storage.local.set({ theme: themeId });
      
      themeModal.style.display = 'none';
      modalContent.classList.remove('theme-modal-fadeout');
    }, 300);
  }
  
  function showNotification(message, type = 'success') {
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout);
      if (notification.classList.contains('show')) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => displayNotification(), 300);
        return;
      }
    }
    
    function displayNotification() {
      notificationMessage.textContent = message;
      notification.className = 'notification';
      notification.classList.add(type);
      void notification.offsetWidth;
      notification.classList.add('show');
      notification.classList.remove('hide');
      
      window.notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        window.notificationTimeout = null;
      }, 3000);
    }
    displayNotification();
  }
  
  function loadSavedData() {
    browser.storage.local.get(['icons', 'theme', 'backgroundImage', 'greeting']).then((result) => {
      if (greetingElement) greetingElement.innerText = result.greeting || 'Welcome!';
      
      if (result.backgroundImage) {
        customBackgroundImage = result.backgroundImage;
        document.body.style.backgroundImage = `url(${result.backgroundImage})`;
        document.body.classList.add('has-bg-image');
      }
      
      if (result.theme) {
        currentTheme = result.theme;
        document.body.classList.forEach(c => {
          if (c.startsWith('theme-')) document.body.classList.remove(c);
        });
        document.body.classList.add(`theme-${currentTheme}`);
        if (customBackgroundImage) document.body.classList.add('has-bg-image');
      } else {
        currentTheme = 'dark';
        document.body.classList.add(`theme-dark`);
      }
      
      if (result.icons) {
        try {
          const savedIcons = JSON.parse(result.icons);
          document.querySelector('.icon-links').innerHTML = '';
          document.querySelector('.icon-links-middle').innerHTML = '';
          document.querySelector('.icon-links1').innerHTML = '';
          
          savedIcons.forEach(icon => {
            const container = document.querySelector('.' + icon.row);
            if (container) {
              const newIcon = createIconElement(icon.url, icon.title, icon.imgSrc);
              container.appendChild(newIcon);
            }
          });
        } catch (e) {
          console.error('Error loading saved icons:', e);
        }
      }
      
      document.querySelectorAll('.icon-container').forEach(icon => {
        if (!icon.hasAttribute('data-href')) icon.setAttribute('data-href', icon.getAttribute('href'));
      });
      
      updateSectionOptions();
      centerIconsInRows();
    });
  }
  
  function saveData() {
    const icons = [];
    document.querySelectorAll('.icon-container').forEach(icon => {
      let row = 'icon-links';
      if (icon.parentElement.classList.contains('icon-links-middle')) row = 'icon-links-middle';
      else if (icon.parentElement.classList.contains('icon-links1')) row = 'icon-links1';
      
      icons.push({
        url: icon.getAttribute('data-href'),
        title: icon.getAttribute('title') || '',
        imgSrc: icon.querySelector('img').src,
        row: row
      });
    });
    browser.storage.local.set({ icons: JSON.stringify(icons) });
  }
  
  function createIconElement(url, title, imgSrc) {
    const newIcon = document.createElement('a');
    newIcon.setAttribute('data-href', url);
    newIcon.href = editMode ? '' : url;
    newIcon.title = title;
    newIcon.target = '_self';
    newIcon.classList.add('icon-container');
    
    if (editMode) {
      newIcon.addEventListener('click', function(e) { e.preventDefault(); });
    }
    
    const img = document.createElement('img');
    img.alt = title || url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    img.src = imgSrc;
    
    const editMenu = document.createElement('div');
    editMenu.classList.add('icon-edit-menu');
    editMenu.innerHTML = `<button class="remove-icon">Remove</button><button class="edit-icon">Edit</button>`;
    
    newIcon.appendChild(img);
    newIcon.appendChild(editMenu);
    return newIcon;
  }
  
  function updateSectionOptions() {
    const topRowCount = document.querySelectorAll('.icon-links > .icon-container').length;
    const middleRowCount = document.querySelectorAll('.icon-links-middle > .icon-container').length;
    const bottomRowCount = document.querySelectorAll('.icon-links1 > .icon-container').length;
    
    const options = rowSelect.querySelectorAll('option');
    options.forEach(opt => {
      opt.disabled = false;
      opt.classList.remove('disabled');
    });
    
    if (topRowCount >= MAX_ICONS_PER_ROW) {
      rowSelect.querySelector('option[value="icon-links"]').disabled = true;
      rowSelect.querySelector('option[value="icon-links"]').classList.add('disabled');
    }
    if (middleRowCount >= MAX_ICONS_PER_ROW) {
      rowSelect.querySelector('option[value="icon-links-middle"]').disabled = true;
      rowSelect.querySelector('option[value="icon-links-middle"]').classList.add('disabled');
    }
    if (bottomRowCount >= MAX_ICONS_PER_ROW) {
      rowSelect.querySelector('option[value="icon-links1"]').disabled = true;
      rowSelect.querySelector('option[value="icon-links1"]').classList.add('disabled');
    }
    
    if (rowSelect.selectedOptions[0] && rowSelect.selectedOptions[0].disabled) {
      for (let i = 0; i < options.length; i++) {
        if (!options[i].disabled) {
          rowSelect.value = options[i].value;
          break;
        }
      }
    }
  }
  
  function centerIconsInRows() {
    ['icon-links', 'icon-links-middle', 'icon-links1'].forEach(rowClass => {
      const row = document.querySelector('.' + rowClass);
      if (row) row.style.justifyContent = 'center';
    });
  }
  
  loadSavedData();
  
  editToggle.addEventListener('click', function() {
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    
    if (greetingElement) {
        greetingElement.contentEditable = editMode;
        if (!editMode) saveGreeting();
    }
    
    if (editMode) {
      // Update button text to indicate we are in edit mode
      editToggle.textContent = "Done";
      
      addIconBtn.style.display = 'flex';
      themeToggle.style.display = 'flex';
      void addIconBtn.offsetWidth;
      void themeToggle.offsetWidth;
      addIconBtn.style.opacity = '1';
      themeToggle.style.opacity = '1';
      addIconBtn.style.transform = 'translateX(0)';
      themeToggle.style.transform = 'translateX(0)';
      showNotification('Edit mode active.');
    } else {
      // Revert button text
      editToggle.textContent = "Edit";
      
      addIconBtn.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      themeToggle.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      addIconBtn.style.opacity = '0';
      themeToggle.style.opacity = '0';
      addIconBtn.style.transform = 'translateX(60px)';
      themeToggle.style.transform = 'translateX(120px)';
      
      setTimeout(() => {
        if (!editMode) {
          addIconBtn.style.display = 'none';
          themeToggle.style.display = 'none';
        }
      }, 300);
      
      saveData();
      showNotification('Changes saved.', 'info');
    }
    
    document.querySelectorAll('.icon-container').forEach(icon => {
      if (editMode) {
        if (!icon.hasAttribute('data-href')) icon.setAttribute('data-href', icon.getAttribute('href'));
        icon.removeAttribute('href');
        icon.addEventListener('click', function(e) { if (editMode) e.preventDefault(); });
      } else {
        const realHref = icon.getAttribute('data-href');
        if (realHref) icon.setAttribute('href', realHref);
      }
    });
  });
  
  document.body.addEventListener('click', function(event) {
    if (editMode && (event.target.closest('.icon-edit-menu') || event.target.closest('.icon-container'))) {
      event.preventDefault();
    }
  }, true);
  
  closeIconModal.addEventListener('click', () => modal.style.display = 'none');
  closeThemeModal.addEventListener('click', () => themeModal.style.display = 'none');
  
  window.addEventListener('click', function(event) {
    if (event.target === modal) modal.style.display = 'none';
    else if (event.target === themeModal) themeModal.style.display = 'none';
  });
  
  addIconBtn.addEventListener('click', function() {
    currentIcon = null;
    modalTitle.textContent = 'Add New Shortcuts';
    document.getElementById('icon-title').value = '';
    document.getElementById('icon-url').value = '';
    document.getElementById('icon-upload').value = '';
    updateSectionOptions();
    
    const availableOption = rowSelect.querySelector('option:not([disabled])');
    if (availableOption) rowSelect.value = availableOption.value;
    else {
      showNotification('All sections are full!', 'error');
      return;
    }
    modal.style.display = 'block';
  });
  
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-icon') && editMode) {
      event.preventDefault();
      event.stopPropagation();
      const iconContainer = event.target.closest('.icon-container');
      if (iconContainer) {
        iconContainer.remove();
        updateSectionOptions();
        centerIconsInRows();
        saveData();
      }
    }
  });
  
  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-icon') && editMode) {
      event.preventDefault();
      event.stopPropagation();
      currentIcon = event.target.closest('.icon-container');
      if (currentIcon) {
        modalTitle.textContent = 'Edit Icon';
        document.getElementById('icon-title').value = currentIcon.getAttribute('title') || '';
        document.getElementById('icon-url').value = currentIcon.getAttribute('data-href') || currentIcon.getAttribute('href');
        
        let sectionValue = 'icon-links';
        if (currentIcon.parentElement.classList.contains('icon-links-middle')) sectionValue = 'icon-links-middle';
        else if (currentIcon.parentElement.classList.contains('icon-links1')) sectionValue = 'icon-links1';
        
        updateSectionOptions();
        document.getElementById('icon-row').value = sectionValue;
        modal.style.display = 'block';
      }
    }
  });
  
  iconForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('icon-title').value || '';
    const url = document.getElementById('icon-url').value;
    const row = document.getElementById('icon-row').value;
    const rowContainer = document.querySelector('.' + row);
    const hasNewImage = document.getElementById('icon-upload').files.length > 0;
    
    if (!currentIcon) {
      const targetRowCount = rowContainer.querySelectorAll('.icon-container').length;
      if (targetRowCount >= MAX_ICONS_PER_ROW) {
        showNotification('This section is full!', 'error');
        updateSectionOptions();
        return;
      }
    }
    
    if (currentIcon) {
      const originalRow = currentIcon.parentElement;
      currentIcon.setAttribute('data-href', url);
      
      if (editMode) currentIcon.removeAttribute('href');
      else currentIcon.setAttribute('href', url);
      
      currentIcon.setAttribute('title', title);
      
      if (!currentIcon.parentElement.classList.contains(row)) {
        const targetRowCount = rowContainer.querySelectorAll('.icon-container').length;
        if (targetRowCount >= MAX_ICONS_PER_ROW) {
          showNotification('Target section is full!', 'error');
          rowSelect.value = originalRow.classList[0];
          return;
        }
        currentIcon.remove();
        rowContainer.appendChild(currentIcon);
      }
      
      if (hasNewImage) {
        const file = document.getElementById('icon-upload').files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          currentIcon.querySelector('img').src = e.target.result;
          currentIcon.querySelector('img').alt = title || url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
          saveData();
        };
        reader.readAsDataURL(file);
      } else {
        saveData();
      }
      showNotification(`Updated ${title ? `"${title}"` : ""} icon.`);
    } else {
      const newIcon = document.createElement('a');
      newIcon.setAttribute('data-href', url);
      newIcon.href = editMode ? '' : url;
      newIcon.title = title;
      newIcon.target = '_self';
      newIcon.classList.add('icon-container');
      
      const img = document.createElement('img');
      img.alt = title || url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      
      const editMenu = document.createElement('div');
      editMenu.classList.add('icon-edit-menu');
      editMenu.innerHTML = `<button class="remove-icon">Remove</button><button class="edit-icon">Edit</button>`;
      
      if (hasNewImage) {
        const file = document.getElementById('icon-upload').files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target.result;
          newIcon.appendChild(img);
          newIcon.appendChild(editMenu);
          rowContainer.appendChild(newIcon);
          showNotification(`Added new ${title ? `"${title}"` : ""} icon.`);
          updateSectionOptions();
          centerIconsInRows();
          saveData();
        };
        reader.readAsDataURL(file);
      } else {
        img.src = 'icons/github.png';
        newIcon.appendChild(img);
        newIcon.appendChild(editMenu);
        rowContainer.appendChild(newIcon);
        showNotification(`Added new ${title ? `"${title}"` : ""} icon.`);
        updateSectionOptions();
        centerIconsInRows();
        saveData();
      }
    }
    modal.style.display = 'none';
  });

  themeToggle.addEventListener('click', function() {
    createThemeOptions();
    themeModal.style.display = 'block';
  });
});
