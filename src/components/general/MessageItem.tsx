import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"

export interface MessageProps {
  message: string
  timeStamp: string
  anonUser: string
}

export function MessageItem({ message, timeStamp, anonUser }: MessageProps) {
  return (
    <div className="flex gap-3 p-4 rounded-xl bg-white dark:bg-purple-800/20 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
      <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-700">
        <AvatarImage>{anonUser.charAt(0).toUpperCase()}</AvatarImage>
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {anonUser.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{anonUser}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{timeStamp}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words">{message}</p>
      </div>
    </div>
  )
}
