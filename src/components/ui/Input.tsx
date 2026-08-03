interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: 'text' | 'email' | 'number' | 'password';
  error?: string;
  helperText?: string;
}
