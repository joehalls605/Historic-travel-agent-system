export function setupSidebarToggle(){
    const burgerIcon = document.getElementById("burger-icon");
    const sidebar = document.getElementById("sidebar");

    if (!burgerIcon || !sidebar) return;

    const toggleSidebar = () => {
        const isOpen = sidebar.classList.toggle("sidebar-open");
        burgerIcon.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    }
    burgerIcon.addEventListener("click", toggleSidebar);
}