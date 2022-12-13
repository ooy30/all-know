      <!-- <p-tree scrollHeight="60vh" [(selection)]="selectedTree" [value]="targetDataList" selectionMode="checkbox"  [filter]="false" filterMode="strict">
            <ng-template let-node pTemplate="default">
                <span *ngIf="node?.treeLevel == 0" class='px-1'><img
                    src="../../../../assets/icons/datadefinition-context-icon.svg"
                    alt=""></span>
            <span *ngIf="node?.isFolder && node?.treeLevel > 0"
                class='px-1'><img src="../../../../assets/icons/data-folder-icon.svg"
                    alt=""></span>
            <span *ngIf="!node?.isFolder" class='px-1'><img
                    src="../../../../assets/icons/datafile-icon.svg" alt=""></span>
                <span class="col-form-label">{{node.name}}</span>
            </ng-template>
            <ng-template let-node pTemplate="text">
                <span class='px-1'><img class="icon-img"
                    src="../../../../assets/icons/font-t-icon.png" alt=""></span>
                <span class="col-form-label">{{node.name}}</span>
            </ng-template>
            <ng-template let-node pTemplate="calendar">
                <span class='px-1'><img class="icon-img"
                    src="../../../../assets/icons/calendar-icon.png" alt=""></span>
                <span class="col-form-label">{{node.name}}</span>
            </ng-template>
        </p-tree> -->
    
    
    
    
    expandAll() {
        this.targetDataList.forEach((node: any) => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.targetDataList.forEach((node: any) => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: any, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach((childNode: any) => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    enableCheckboxAll(){
      this.targetDataList.forEach((node: any) => {
        this.enableCheckRecursive(node, true);
    });
    }

    disiabledCheckboxAll(){
      this.targetDataList.forEach((node: any) => {
        this.enableCheckRecursive(node, false);
    });
    }

    private enableCheckRecursive(node: any, isEnable: boolean) {
      node.selectable = isEnable;
      if (node.children) {
          node.children.forEach((childNode: any) => {
              this.enableCheckRecursive(childNode, isEnable);
          });
      }
  }

  private partialSelectedRecursive(node: any, isPartialSelected: boolean) {
    node.partialSelected = isPartialSelected;
    if (node.children) {
        node.children.forEach((childNode: any) => {
            this.partialSelectedRecursive(childNode, isPartialSelected);
        });
    }
}

  applyFilter(filterText: string) {
        this.selectedTree = [];
        this.filterTree(filterText);
          if (filterText) {
        this.expandAll();
          } else {
            // this.collapseAll();
            this.expandAll();
          }
    }

    filterTree(filterText: string) {
        console.log('filterTree');
        const dataSearch = this.dataAvailable;
        this.targetDataList = this.filterRecursive(
            filterText,
            dataSearch,
            'name'
        );
    }

    filterRecursive(filterText: string, array: any[], property: string) {
        let filteredData;
        function copy(o: any) {
            return Object.assign({}, o);
        }
        if (filterText) {
            filterText = filterText.toLowerCase();
            filteredData = array.map(copy).filter(function x(y) {
                if (y[property].toLowerCase().includes(filterText)) {
                    return true;
                }
                if (y.children) {
                    return (y.children = y.children.map(copy).filter(x)).length;
                }
            });
        } else {
            filteredData = array;
        }
        return filteredData;
    }
