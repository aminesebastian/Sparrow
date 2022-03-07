import { IBrowserTab, IUserData } from '../../../../app/services/user-data-access';
import { Injectable } from '@angular/core';
import { IpcResponse, PascoElectronService } from '../pasco-electron/pasco-electron.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userData: IUserData;

  constructor(private electron: PascoElectronService) {
    this.electron.ipcRenderer.on('pasco/user-data', (event, data) => {
      this.userData = data;
    });
  }

  public getUserData(): IUserData {
    return this.userData;
  }

  public getTabs(): IBrowserTab[] {
    return this.userData.tabs;
  }

  public getTabById(id: string): IBrowserTab {
    for (const tab of this.userData.tabs) {
      if (tab.id === id) {
        return tab;
      }
    }
    return undefined;
  }

  public addTab(name: string) {
    this.userData.tabs.push({
      name,
      id: 'random',
      instances: [
        {
          id: 'random1',
          url: 'https://www.google.com'
        }
      ]
    });
  }
  public removeTab(tabId: string) {
    const index = this.getTabIndexFromId(tabId);
    if (index >= 0) {
      this.userData.tabs.splice(index);
    }
  }
  public getTabIndexFromId(tabId: string) {
    let index = -1;
    for (let i = 0; i < this.userData.tabs.length; i++) {
      if (this.userData.tabs[i].id === tabId) {
        index = i;
      }
    }
    return index;
  }

  public addInstanceToTab(tabId: string, url: string) {
    const tab = this.getTabById(tabId);
    if (tab) {
      tab.instances.push({
        id: 'random',
        url
      });
    }
  }

  public removeInstanceFromTab(tabId: string, instanceId: string) {
    const index = this.getInstanceIndexFromTabById(tabId, instanceId);
    if (index >= 0) {
      this.getTabById(tabId).instances.splice(index);
    }
  }

  public getInstanceIndexFromTabById(tabId: string, instanceId: string) {
    let index = -1;
    const tab = this.getTabById(tabId);
    if (tab) {
      for (let i = 0; i < tab.instances.length; i++) {
        if (tab.instances[i].id === instanceId) {
          index = i;
        }
      }
    }
    return index;
  }


  public initialize(): Promise<any> {
    return new Promise((resolve) => {
      this.electron.ipcRenderer.send('pasco/user-data');
      this.electron.ipcRenderer.on('pasco/user-data', (event, data) => {
        this.userData = data;
        if (!this.userData) {
          this.userData = this.createDefaultUserData();
        }
        console.log(this.userData);
        resolve(undefined);
      });
    });
  }
  private createDefaultUserData(): IUserData {
    return {
      version: 1,
      tabs: [
        {
          name: 'DefaultTab',
          id: 'random',
          instances: [
            {
              id: 'random',
              url: 'https://www.google.com'
            }
          ]
        }
      ]
    };
  }
}
