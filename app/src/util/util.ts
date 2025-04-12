export enum Status {
  Pending = 'pending',
  InProgress = 'in-progress',
  Resolved = 'resolved',
  Closed = 'closed',
}

export const formatDate = (dateString?: string | Date) => {
  const date = new Date(dateString ?? Date.now())
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const formatStatus = (status: Status) => {
  switch (status) {
    case Status.Pending:
      return 'Pending'
    case Status.InProgress:
      return 'In Progress'
    case Status.Resolved:
      return 'Resolved'
    case Status.Closed:
      return 'Closed'
    default:
      return status
  }
}

export const timeAgo = (dateString?: string) => {
  const date = new Date(dateString ?? Date.now());
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}