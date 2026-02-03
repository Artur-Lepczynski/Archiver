import { DiffNode, DiffTag, RawNode } from "../types/diff.types";

export function diffFolders(
  source: RawNode,
  archive: RawNode,
): { source: DiffNode; archive: DiffNode } {
  const { sourceNode, archiveNode } = diffPair(source, archive);

  const res: { source: DiffNode; archive: DiffNode } = {
    source: sourceNode!,
    archive: archiveNode!,
  };
  return res;
}

function diffPair(
  sourceNode?: RawNode,
  archiveNode?: RawNode,
): { sourceNode?: DiffNode; archiveNode?: DiffNode } {
  if (!archiveNode) return { sourceNode: markAll(sourceNode!, DiffTag.MISSING) };
  if (!sourceNode) return { archiveNode: markAll(archiveNode, DiffTag.EXTRA) };

  if (sourceNode.type === "file" && archiveNode.type === "file") {
    const extensionsTheSame = sourceNode.extension === archiveNode.extension;
    const newSourceNode: DiffNode = {
      name: sourceNode.name,
      type: sourceNode.type,
      extension: sourceNode.extension,
      tag: extensionsTheSame ? DiffTag.OK : DiffTag.MISSING,
    };
    const newArchiveNode: DiffNode = {
      name: archiveNode.name,
      type: archiveNode.type,
      extension: archiveNode.extension,
      tag: extensionsTheSame ? DiffTag.NONE : DiffTag.EXTRA,
    };

    return { sourceNode: newSourceNode, archiveNode: newArchiveNode };
  }

  if (sourceNode.type !== archiveNode.type) {
    markAll(sourceNode, DiffTag.MISSING);
    markAll(archiveNode, DiffTag.EXTRA);
  }

  const sourceChildrenMap = new Map(sourceNode.children?.map((child) => [child.name, child]) ?? []);
  const archiveChildrenMap = new Map(
    archiveNode.children?.map((child) => [child.name, child]) ?? [],
  );

  const allObjectNames = new Set([...sourceChildrenMap.keys(), ...archiveChildrenMap.keys()]);

  const sourceChildren: DiffNode[] = [];
  const archiveChildren: DiffNode[] = [];

  allObjectNames.forEach((name) => {
    const { sourceNode: newSourceNode, archiveNode: newArchiveNode } = diffPair(
      sourceChildrenMap.get(name),
      archiveChildrenMap.get(name),
    );
    if (newSourceNode) sourceChildren.push(newSourceNode);
    if (newArchiveNode) archiveChildren.push(newArchiveNode);
  });

  return {
    sourceNode: {
      ...sourceNode,
      children: sourceChildren,
      tag: deriveSourceFolderTag(sourceChildren),
    },
    archiveNode: {
      ...archiveNode,
      children: archiveChildren,
      tag: deriveArchiveFolderTag(archiveChildren),
    },
  };
}

function markAll(node: RawNode, as: DiffTag): DiffNode {
  return {
    ...node,
    tag: as,
    children: node.children?.map((child) => markAll(child, as)),
  };
}

function deriveSourceFolderTag(children: DiffNode[]) {
  const allOk = children.every((child) => child.tag === DiffTag.OK);
  return allOk ? DiffTag.OK : DiffTag.MISSING_FILES;
}

function deriveArchiveFolderTag(children: DiffNode[]) {
  const someExtra = children.some(
    (child) => child.tag === DiffTag.EXTRA || child.tag === DiffTag.EXTRA_FILES,
  );
  return someExtra ? DiffTag.EXTRA_FILES : DiffTag.NONE;
}
