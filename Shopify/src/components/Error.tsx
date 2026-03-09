interface Props{
    message:string
}

export default function Error({message}:Props) {
    
  return (
    <p style={{ color: "red" }}>{message}</p>
  )
}
