
const sizes = ['B', 'KB', 'MB', 'GB'];

const sizeText = (size) => {
    let l = 0;
    let s = size;
    while (s / 1024 > 1) {
        s = s / 1024;
        l += 1;
    }
    return s.toFixed(2) + sizes[l];
}

export default {
    sizeText,
};
