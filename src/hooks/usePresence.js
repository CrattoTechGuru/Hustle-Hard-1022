import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function usePresence(channelName) {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const channel = supabase.channel(channelName, {
      config: { presence: { key: crypto.randomUUID() } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setCount(Object.keys(state).length || 1)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName])

  return count
}
