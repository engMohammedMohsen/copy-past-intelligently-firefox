let settings = readSettingsFromLocalStorage();

function readSettingsFromLocalStorage() {
  const settingsString = localStorage.getItem("settings");
  if (settingsString) {
    return JSON.parse(settingsString);
  } else {
    const defaultSettings = {
      smartPast: true,
      formatCopy: true,
      formatText: "$url\n",
    };
    writeSettingsToLocalStorage(defaultSettings);
    return defaultSettings;
  }
}

function writeSettingsToLocalStorage(settings) {
  const settingsString = JSON.stringify(settings);
  localStorage.setItem("settings", settingsString);
}

function updateSettingGui() {
  const settingsgui = readSettingsFromLocalStorage();
  const chk_formatCopy = document.getElementById("chk_formatCopy");
  chk_formatCopy.checked = settingsgui.formatCopy;
  const chk_smartPast = document.getElementById("chk_smartPast");
  chk_smartPast.checked = settingsgui.smartPast;
  const txt_format = document.getElementById("txt_format");
  txt_format.value = settingsgui.formatText;
}

try {
  console.log("options: ", settings);
  document.addEventListener("DOMContentLoaded", function () {
    updateSettingGui();
    document
      .getElementById("txt_format")
      .addEventListener("input", function (event) {
        settings.formatText = event.target.value;
        console.log("Change format text to: ", settings.formatText);
        writeSettingsToLocalStorage(settings);
        console.log("change Done");
      });
    document
      .getElementById("chk_formatCopy")
      .addEventListener("change", function () {
        settings.formatCopy = this.checked;
        console.log("Change format text to: ", settings.formatCopy);
        writeSettingsToLocalStorage(settings);
        console.log("change Done");
      });
    document
      .getElementById("chk_smartPast")
      .addEventListener("change", function () {
        settings.smartPast = this.checked;
        console.log("Change format text to: ", settings.smartPast);
        writeSettingsToLocalStorage(settings);
        console.log("change Done");
      });
    console.log("new options: ", settings);
  });
} catch (error) {
  console.log(error);
}
