export const formValidateMessages = {
  required: "${label} alanı boş bırakılamaz!",
  types: {
    email: "${label} geçerli bir e-posta adresi değil!",
  },
  number: {
    range: "${label} ${min} ile ${max} arasında olmalıdır!",
    min: "${label} en az ${min} olmalıdır!",
    max: "${label} en fazla ${max} olmalıdır!",
  },
  string: {
    range: "${label} ${min} ile ${max} arasında olmalıdır!",
    min: "${label} en az ${min} karakter olmalıdır!",
    max: "${label} en fazla ${max} karakter olmalıdır!",
  },
}
