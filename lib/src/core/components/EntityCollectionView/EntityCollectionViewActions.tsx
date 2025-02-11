import React from "react";
import {
    Button,
    IconButton,
    Tooltip,
    useMediaQuery,
    useTheme
} from "@mui/material";

import { Add, Delete } from "@mui/icons-material";
import { ExportButton } from "../EntityCollectionTable/internal/ExportButton";

import { canCreateEntity, canDeleteEntity } from "../../util/permissions";
import { useAuthController, useFireCMSContext } from "../../../hooks";
import {
    Entity,
    EntityCollection,
    ExportConfig,
    SelectionController
} from "../../../types";
import { fullPathToCollectionSegments } from "../../util/paths";

export type EntityCollectionViewActionsProps<M extends Record<string, any>> = {
    collection: EntityCollection<M>;
    fullPath: string;
    selectionEnabled: boolean;
    exportable: boolean | ExportConfig;
    onNewClick: () => void;
    onMultipleDeleteClick: () => void;
    selectedEntities: Entity<M>[];
    selectionController: SelectionController<M>;
}

export function EntityCollectionViewActions<M extends Record<string, any>>({
                                                                               collection,
                                                                               onNewClick,
                                                                               exportable,
                                                                               onMultipleDeleteClick,
                                                                               selectionEnabled,
                                                                               fullPath,
                                                                               selectionController,
                                                                               selectedEntities
                                                                           }: EntityCollectionViewActionsProps<M>) {

    const context = useFireCMSContext();
    const authController = useAuthController();

    const theme = useTheme();
    const largeLayout = useMediaQuery(theme.breakpoints.up("md"));

    const addButton = canCreateEntity(collection, authController, fullPathToCollectionSegments(fullPath), null) &&
        onNewClick && (largeLayout
            ? <Button
                onClick={onNewClick}
                startIcon={<Add/>}
                size="large"
                variant="contained"
                color="primary">
                Add {collection.singularName ?? collection.name}
            </Button>
            : <Button
                onClick={onNewClick}
                size="medium"
                variant="contained"
                color="primary"
            >
                <Add/>
            </Button>);

    const multipleDeleteEnabled = canDeleteEntity(collection, authController, fullPathToCollectionSegments(fullPath), null);

    let multipleDeleteButton: React.ReactNode | undefined;
    if (selectionEnabled) {
        const button = largeLayout
            ? <Button
                disabled={!(selectedEntities?.length) || !multipleDeleteEnabled}
                startIcon={<Delete/>}
                onClick={onMultipleDeleteClick}
                color={"primary"}
                sx={{ minWidth: 68 }}
            >
                ({selectedEntities?.length})
            </Button>
            : <IconButton
                color={"primary"}
                disabled={!(selectedEntities?.length) || !multipleDeleteEnabled}
                onClick={onMultipleDeleteClick}
                size="large">
                <Delete/>
            </IconButton>;
        multipleDeleteButton =
            <Tooltip
                title={multipleDeleteEnabled ? "Delete" : "You have selected at least one entity you cannot delete"}>
                <span>{button}</span>
            </Tooltip>
    }

    const actionProps = {
        path: fullPath,
        collection,
        selectionController,
        context
    };

    const actions = collection.Actions
        ? Array.isArray(collection.Actions)
            ? <>
                {collection.Actions.map((Action, i) => (
                    <Action key={`actions_${i}`} {...actionProps} />
                ))}
            </>
            : <collection.Actions {...actionProps} />
        : undefined;

    const exportButton = exportable &&
        <ExportButton collection={collection}
                      exportConfig={typeof collection.exportable === "object" ? collection.exportable : undefined}
                      path={fullPath}/>;
    return (
        <>
            {actions}
            {multipleDeleteButton}
            {exportButton}
            {addButton}
        </>
    );
}
