import type { Comment } from "../types";
import type { CommentTreeNode } from "./CommentNode";

export type CommentTree = { comment: Comment; children: CommentTreeNode[]}

export function buildCommentTree(comments: Comment[]): CommentTree[] {
  const map = new Map<number, CommentTreeNode>(); 
    const roots: CommentTree[] = []; 

    comments.forEach((c) => map.set(c.id, { comment: c, children: []}))

    comments.forEach((c) => {
        if (c.comment && map.has(c.comment)) {
            map.get(c.comment)!.children.push(map.get(c.id)!)
        } else {
            roots.push(map.get(c.id)!)
        }
    })

    const sortNodes = (nodes: CommentTreeNode[]) => {
        nodes.sort((a, b) => a.comment.creationDate.localeCompare(b.comment.creationDate))
        nodes.forEach((n) => sortNodes(n.children))
    }
    sortNodes(roots)

    return roots
}