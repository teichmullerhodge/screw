import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import configLayout from "/assets/config_layout.png";

type UserTheme = "dark" | "clear" | "system"

interface UserSettings {
   openProjectAfterCreation: boolean,
   defaultNewProjectView: string, 
   defaultProjectsView: string, 
   theme: UserTheme,
   sidebarCollapsed: boolean  
}


const DEFAULT_SETTINGS: UserSettings = {
    theme: "system",
    defaultNewProjectView: "grid grid-cols-3",
    defaultProjectsView: "grid grid-cols-2",
    sidebarCollapsed: false,
    openProjectAfterCreation: false

}

export default function Settings() {

  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const userSettings = localStorage.getItem("user-settings");
    if(userSettings === null) return;
    try {
      const parsed = JSON.parse(userSettings) as UserSettings;
      setSettings(parsed);
    } catch (_) {}
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem("user-settings", JSON.stringify(settings));
    toast.success("Settings saved.");
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8 bg-white">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Configurations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your preferences and application settings
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className='flex flex-row items-center justify-center'>
                  <h2 className="text-lg font-semibold">Theme</h2>
                  <span className="ml-auto bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-full font-medium">Soon</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select your theme 
                </p>
              </div>
              <Select disabled value={settings.theme} onValueChange={(theme) => setSettings(prev => ({...prev, theme: theme as UserTheme}))}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecionar tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Projects configuration</h2>
                <p className="text-sm text-muted-foreground">
                  Control if a project should be opened after creation 
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="open-project">Open project after creation</Label>
                    <p className="text-xs text-muted-foreground">
                      Open the root folder of your project after creation. 
                    </p>
                  </div>
                  <Switch
                    id="open-project"
                    checked={settings.openProjectAfterCreation}
                    onCheckedChange={async (checked) => {
                      setSettings(prev => ({ ...prev, openProjectAfterCreation: checked }))
                      }
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Layout</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sidebarCollapsed">Sidebar collapsed</Label>
                    <p className="text-xs text-muted-foreground">
                      Show sidebar collapsed
                    </p>
                  </div>
                  <Switch
                    id="sidebarCollapsed"
                    checked={settings.sidebarCollapsed}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, sidebarCollapsed: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <Button variant="outline" type="button" onClick={() => {
                localStorage.removeItem("user-settings")
                setSettings(DEFAULT_SETTINGS);
                toast.message("Settings restored.");
              }}>
               Default settings
              </Button>
              <div className="flex gap-3">
                <Button onClick={handleSaveSettings} type="button">
                  Save settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <img
          src={configLayout}
          className='opacity-50'
          alt="ilustration"
          width={200} 
          height={200}
        />
      </div>
    </div>
  );
}
