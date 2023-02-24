import { EventEmitter, Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

@Injectable()
export class TaskSyncronizerService {
    tasks: any[] = [];
    stopTasks = false;

    constructor(private modelService: BsModalService) {

    }

    registerTask(task: any, name: string, message: string, data: any = null) {
        this.tasks.push({
            task,
            name,
            message,
            data
        });
    }

    start(): Observable<any> {
        this.stopTasks = false;
        const taskStatus = new EventEmitter<any>();
        setTimeout(async () => {
            let index = 0;
            for (const t of this.tasks) {
                try {
                    taskStatus.next({
                        name: t.name,
                        message: t.message,
                        status: 'InProgress'
                    });
                    const result = await t.task.toPromise();
                    if (this.stopTasks) {
return;
}
                    taskStatus.next({
                        name: t.name,
                        result,
                        message: t.message,
                        status: 'Done',
                        data: t.data
                    });
                } catch (error) {
                    taskStatus.error({
                        error,
                        name: t.name,
                        stop() {
                            this.stopTasks = true;
                        }
                    });
                }
                index++;
            }
            if (index === this.tasks.length && !this.stopTasks) {
taskStatus.complete();
}
            this.clear();
        });
        return taskStatus;
    }

    terminate() {
        this.stopTasks = true;
    }

    clear() {
        this.tasks.splice(0, this.tasks.length);
    }
}
