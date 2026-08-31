type SignatureLogoProps = {
  className?: string
}

/** Theme-aware signature mark. The visible image is selected by the site's data-theme. */
export default function SignatureLogo({ className = '' }: SignatureLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`signature-logo${className ? ` ${className}` : ''}`}
    />
  )
}
