type ErrorMessageProps = {
  message?: string
}

function ErrorMessage({ message = 'Something went wrong.' }: ErrorMessageProps) {
  return (
    <div className="rounded-md border border-red-900 bg-red-950/50 text-red-300 px-3 py-2">
      {message}
    </div>
  )
}

export default ErrorMessage


