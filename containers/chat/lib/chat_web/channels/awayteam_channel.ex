defmodule ChatWeb.AwayteamChannel do
  require Logger
  use ChatWeb, :channel
  alias ChatWeb.Presence

  def join("awayteam:default", _, socket) do
    if authorized?() do
      send self(), :after_join
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_info(:after_join, socket) do
    unleashContext = %{
      session_id: socket.assigns.id,
    }
    Presence.track(socket, socket.assigns.id, %{
      user: socket.assigns.user,
      online_at: :os.system_time(:milli_seconds),
    })
    push socket, "presence_state", Presence.list(socket)
    {:noreply, socket}
  end

  def handle_in("message:new", message, socket) do
    broadcast! socket, "message:new", %{
      id: socket.assigns.id,
      user: socket.assigns.user,
      body: message,
      timestamp: :os.system_time(:milli_seconds)
    }
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?() do
    true
  end
end
