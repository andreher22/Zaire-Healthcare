/**
 * Paleta de colores ZAIRE Healthcare
 * Basada en el manual de identidad
 */

export const colors = {
    // Primarios
    darkOliveGreen: '#606C38', // Botones principales, headers
    kombuGreen: '#283618',     // Navbar, textos sobre claro
    cornsilk: '#FEFAE0',       // Fondo principal, cards

    // Secundarios
    fawn: '#DDA15E',           // Acentos, iconos activos
    liver: '#BC6C25',          // Alertas, badges

    // Neutros
    white: '#FFFFFF',
    black: '#000000',
    gray: '#F5F5F5',
    darkGray: '#333333',
    error: '#B00020',
    success: '#4CAF50',
};

export const theme = {
    colors: {
        primary: colors.darkOliveGreen,
        accent: colors.fawn,
        background: colors.cornsilk,
        surface: colors.white,
        text: colors.kombuGreen,
        placeholder: colors.fawn,
        notification: colors.liver,
    },
};
