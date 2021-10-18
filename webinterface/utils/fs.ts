import {abort} from "./output"

var PATH = {splitPath:function(filename : string) {
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  return splitPathRe.exec(filename).slice(1);
},normalizeArray:function(parts : Array<string>, allowAboveRoot: boolean) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }
  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up; up--) {
      parts.unshift('..');
    }
  }
  return parts;
},normalize:function(path: string) {
  var isAbsolute = path.charAt(0) === '/',
      trailingSlash = path.substr(-1) === '/';
  // Normalize the path
  path = PATH.normalizeArray(path.split('/').filter(function(p) {
    return !!p;
  }), !isAbsolute).join('/');
  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  return (isAbsolute ? '/' : '') + path;
},dirname:function(path:string) {
  var result = PATH.splitPath(path),
      root = result[0],
      dir = result[1];
  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }
  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
},basename:function(path:string) {
  // EMSCRIPTEN return '/'' for '/', not an empty string
  if (path === '/') return '/';
  path = PATH.normalize(path);
  path = path.replace(/\/$/, "");
  var lastSlash = path.lastIndexOf('/');
  if (lastSlash === -1) return path;
  return path.substr(lastSlash+1);
},extname:function(path:string) {
  return PATH.splitPath(path)[3];
},join:function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return PATH.normalize(paths.join('/'));
},join2:function(l : string, r : string) {
  return PATH.normalize(l + '/' + r);
}};

var PATH_FS = {
  resolve: function () {
    var resolvedPath = '',
      resolvedAbsolute = false;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? arguments[i] : FS.cwd();
      // Skip empty and invalid entries
      if (typeof path !== 'string') {
        throw new TypeError('Arguments to path.resolve must be strings');
      } else if (!path) {
        return ''; // an invalid portion invalidates the whole thing
      }
      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function (p) {
      return !!p;
    }), !resolvedAbsolute).join('/');
    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
  }, relative: function (from: string, to: string) {
    from = PATH_FS.resolve(from).substr(1);
    to = PATH_FS.resolve(to).substr(1);
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join('/');
  }
};

var FS = {
  // root: null, 
  // mounts: [], 
  // devices: {}, 
  // streams: [], 
  // nextInode: 1, 
  // nameTable: null, 
  // currentPath: "/", 
  // initialized: false, 
  // ignorePermissions: true, 
  ErrnoError: number = null, 
  // genericErrors: {}, 
  // filesystems: null, 
  // syncFSRequests: 0, 
  // lookupPath: function (path, opts) {
//     path = PATH_FS.resolve(FS.cwd(), path);
//     opts = opts || {};

//     if (!path) return { path: '', node: null };

//     var defaults = {
//       follow_mount: true,
//       recurse_count: 0
//     };
//     for (var key in defaults) {
//       if (opts[key] === undefined) {
//         opts[key] = defaults[key];
//       }
//     }

//     if (opts.recurse_count > 8) {  // max recursive lookup of 8
//       throw new FS.ErrnoError(32);
//     }

//     // split the path
//     var parts = PATH.normalizeArray(path.split('/').filter(function (p) {
//       return !!p;
//     }), false);

//     // start at the root
//     var current = FS.root;
//     var current_path = '/';

//     for (var i = 0; i < parts.length; i++) {
//       var islast = (i === parts.length - 1);
//       if (islast && opts.parent) {
//         // stop resolving
//         break;
//       }

//       current = FS.lookupNode(current, parts[i]);
//       current_path = PATH.join2(current_path, parts[i]);

//       // jump to the mount's root node if this is a mountpoint
//       if (FS.isMountpoint(current)) {
//         if (!islast || (islast && opts.follow_mount)) {
//           current = current.mounted.root;
//         }
//       }

//       // by default, lookupPath will not follow a symlink if it is the final path component.
//       // setting opts.follow = true will override this behavior.
//       if (!islast || opts.follow) {
//         var count = 0;
//         while (FS.isLink(current.mode)) {
//           var link = FS.readlink(current_path);
//           current_path = PATH_FS.resolve(PATH.dirname(current_path), link);

//           var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
//           current = lookup.node;

//           if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
//             throw new FS.ErrnoError(32);
//           }
//         }
//       }
//     }

//     return { path: current_path, node: current };
//   }, getPath: function (node) {
//     var path;
//     while (true) {
//       if (FS.isRoot(node)) {
//         var mount = node.mount.mountpoint;
//         if (!path) return mount;
//         return mount[mount.length - 1] !== '/' ? mount + '/' + path : mount + path;
//       }
//       path = path ? node.name + '/' + path : node.name;
//       node = node.parent;
//     }
//   }, hashName: function (parentid, name) {
//     var hash = 0;

//     for (var i = 0; i < name.length; i++) {
//       hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
//     }
//     return ((parentid + hash) >>> 0) % FS.nameTable.length;
//   }, hashAddNode: function (node) {
//     var hash = FS.hashName(node.parent.id, node.name);
//     node.name_next = FS.nameTable[hash];
//     FS.nameTable[hash] = node;
//   }, hashRemoveNode: function (node) {
//     var hash = FS.hashName(node.parent.id, node.name);
//     if (FS.nameTable[hash] === node) {
//       FS.nameTable[hash] = node.name_next;
//     } else {
//       var current = FS.nameTable[hash];
//       while (current) {
//         if (current.name_next === node) {
//           current.name_next = node.name_next;
//           break;
//         }
//         current = current.name_next;
//       }
//     }
//   }, lookupNode: function (parent, name) {
//     var errCode = FS.mayLookup(parent);
//     if (errCode) {
//       throw new FS.ErrnoError(errCode, parent);
//     }
//     var hash = FS.hashName(parent.id, name);
//     for (var node = FS.nameTable[hash]; node; node = node.name_next) {
//       var nodeName = node.name;
//       if (node.parent.id === parent.id && nodeName === name) {
//         return node;
//       }
//     }
//     // if we failed to find it in the cache, call into the VFS
//     return FS.lookup(parent, name);
//   }, createNode: function (parent, name, mode, rdev) {
//     assert(typeof parent === 'object')
//     var node = new FS.FSNode(parent, name, mode, rdev);

//     FS.hashAddNode(node);

//     return node;
//   }, destroyNode: function (node) {
//     FS.hashRemoveNode(node);
//   }, isRoot: function (node) {
//     return node === node.parent;
//   }, isMountpoint: function (node) {
//     return !!node.mounted;
//   }, isFile: function (mode) {
//     return (mode & 61440) === 32768;
//   }, isDir: function (mode) {
//     return (mode & 61440) === 16384;
//   }, isLink: function (mode) {
//     return (mode & 61440) === 40960;
//   }, isChrdev: function (mode) {
//     return (mode & 61440) === 8192;
//   }, isBlkdev: function (mode) {
//     return (mode & 61440) === 24576;
//   }, isFIFO: function (mode) {
//     return (mode & 61440) === 4096;
//   }, isSocket: function (mode) {
//     return (mode & 49152) === 49152;
//   }, flagModes: { "r": 0, "r+": 2, "w": 577, "w+": 578, "a": 1089, "a+": 1090 }, modeStringToFlags: function (str) {
//     var flags = FS.flagModes[str];
//     if (typeof flags === 'undefined') {
//       throw new Error('Unknown file open mode: ' + str);
//     }
//     return flags;
//   }, flagsToPermissionString: function (flag) {
//     var perms = ['r', 'w', 'rw'][flag & 3];
//     if ((flag & 512)) {
//       perms += 'w';
//     }
//     return perms;
//   }, nodePermissions: function (node, perms) {
//     if (FS.ignorePermissions) {
//       return 0;
//     }
//     // return 0 if any user, group or owner bits are set.
//     if (perms.includes('r') && !(node.mode & 292)) {
//       return 2;
//     } else if (perms.includes('w') && !(node.mode & 146)) {
//       return 2;
//     } else if (perms.includes('x') && !(node.mode & 73)) {
//       return 2;
//     }
//     return 0;
//   }, mayLookup: function (dir) {
//     var errCode = FS.nodePermissions(dir, 'x');
//     if (errCode) return errCode;
//     if (!dir.node_ops.lookup) return 2;
//     return 0;
//   }, mayCreate: function (dir, name) {
//     try {
//       var node = FS.lookupNode(dir, name);
//       return 20;
//     } catch (e) {
//     }
//     return FS.nodePermissions(dir, 'wx');
//   }, mayDelete: function (dir, name, isdir) {
//     var node;
//     try {
//       node = FS.lookupNode(dir, name);
//     } catch (e) {
//       return e.errno;
//     }
//     var errCode = FS.nodePermissions(dir, 'wx');
//     if (errCode) {
//       return errCode;
//     }
//     if (isdir) {
//       if (!FS.isDir(node.mode)) {
//         return 54;
//       }
//       if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
//         return 10;
//       }
//     } else {
//       if (FS.isDir(node.mode)) {
//         return 31;
//       }
//     }
//     return 0;
//   }, mayOpen: function (node, flags) {
//     if (!node) {
//       return 44;
//     }
//     if (FS.isLink(node.mode)) {
//       return 32;
//     } else if (FS.isDir(node.mode)) {
//       if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
//         (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
//         return 31;
//       }
//     }
//     return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
//   }, MAX_OPEN_FDS: 4096, nextfd: function (fd_start, fd_end) {
//     fd_start = fd_start || 0;
//     fd_end = fd_end || FS.MAX_OPEN_FDS;
//     for (var fd = fd_start; fd <= fd_end; fd++) {
//       if (!FS.streams[fd]) {
//         return fd;
//       }
//     }
//     throw new FS.ErrnoError(33);
//   }, getStream: function (fd) {
//     return FS.streams[fd];
//   }, createStream: function (stream, fd_start, fd_end) {
//     if (!FS.FSStream) {
//       FS.FSStream = /** @constructor */ function () { };
//       FS.FSStream.prototype = {
//         object: {
//           get: function () { return this.node; },
//           set: function (val) { this.node = val; }
//         },
//         isRead: {
//           get: function () { return (this.flags & 2097155) !== 1; }
//         },
//         isWrite: {
//           get: function () { return (this.flags & 2097155) !== 0; }
//         },
//         isAppend: {
//           get: function () { return (this.flags & 1024); }
//         }
//       };
//     }
//     // clone it, so we can return an instance of FSStream
//     var newStream = new FS.FSStream();
//     for (var p in stream) {
//       newStream[p] = stream[p];
//     }
//     stream = newStream;
//     var fd = FS.nextfd(fd_start, fd_end);
//     stream.fd = fd;
//     FS.streams[fd] = stream;
//     return stream;
//   }, closeStream: function (fd) {
//     FS.streams[fd] = null;
//   }, chrdev_stream_ops: {
//     open: function (stream) {
//       var device = FS.getDevice(stream.node.rdev);
//       // override node's stream ops with the device's
//       stream.stream_ops = device.stream_ops;
//       // forward the open call
//       if (stream.stream_ops.open) {
//         stream.stream_ops.open(stream);
//       }
//     }, llseek: function () {
//       throw new FS.ErrnoError(70);
//     }
//   }, major: function (dev) {
//     return ((dev) >> 8);
//   }, minor: function (dev) {
//     return ((dev) & 0xff);
//   }, makedev: function (ma, mi) {
//     return ((ma) << 8 | (mi));
//   }, registerDevice: function (dev, ops) {
//     FS.devices[dev] = { stream_ops: ops };
//   }, getDevice: function (dev) {
//     return FS.devices[dev];
//   }, getMounts: function (mount) {
//     var mounts = [];
//     var check = [mount];

//     while (check.length) {
//       var m = check.pop();

//       mounts.push(m);

//       check.push.apply(check, m.mounts);
//     }

//     return mounts;
//   }, syncfs: function (populate, callback) {
//     if (typeof (populate) === 'function') {
//       callback = populate;
//       populate = false;
//     }

//     FS.syncFSRequests++;

//     if (FS.syncFSRequests > 1) {
//       err('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
//     }

//     var mounts = FS.getMounts(FS.root.mount);
//     var completed = 0;

//     function doCallback(errCode) {
//       assert(FS.syncFSRequests > 0);
//       FS.syncFSRequests--;
//       return callback(errCode);
//     }

//     function done(errCode) {
//       if (errCode) {
//         if (!done.errored) {
//           done.errored = true;
//           return doCallback(errCode);
//         }
//         return;
//       }
//       if (++completed >= mounts.length) {
//         doCallback(null);
//       }
//     };

//     // sync all mounts
//     mounts.forEach(function (mount) {
//       if (!mount.type.syncfs) {
//         return done(null);
//       }
//       mount.type.syncfs(mount, populate, done);
//     });
//   }, mount: function (type, opts, mountpoint) {
//     if (typeof type === 'string') {
//       // The filesystem was not included, and instead we have an error
//       // message stored in the variable.
//       throw type;
//     }
//     var root = mountpoint === '/';
//     var pseudo = !mountpoint;
//     var node;

//     if (root && FS.root) {
//       throw new FS.ErrnoError(10);
//     } else if (!root && !pseudo) {
//       var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

//       mountpoint = lookup.path;  // use the absolute path
//       node = lookup.node;

//       if (FS.isMountpoint(node)) {
//         throw new FS.ErrnoError(10);
//       }

//       if (!FS.isDir(node.mode)) {
//         throw new FS.ErrnoError(54);
//       }
//     }

//     var mount = {
//       type: type,
//       opts: opts,
//       mountpoint: mountpoint,
//       mounts: []
//     };

//     // create a root node for the fs
//     var mountRoot = type.mount(mount);
//     mountRoot.mount = mount;
//     mount.root = mountRoot;

//     if (root) {
//       FS.root = mountRoot;
//     } else if (node) {
//       // set as a mountpoint
//       node.mounted = mount;

//       // add the new mount to the current mount's children
//       if (node.mount) {
//         node.mount.mounts.push(mount);
//       }
//     }

//     return mountRoot;
//   }, unmount: function (mountpoint) {
//     var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

//     if (!FS.isMountpoint(lookup.node)) {
//       throw new FS.ErrnoError(28);
//     }

//     // destroy the nodes for this mount, and all its child mounts
//     var node = lookup.node;
//     var mount = node.mounted;
//     var mounts = FS.getMounts(mount);

//     Object.keys(FS.nameTable).forEach(function (hash) {
//       var current = FS.nameTable[hash];

//       while (current) {
//         var next = current.name_next;

//         if (mounts.includes(current.mount)) {
//           FS.destroyNode(current);
//         }

//         current = next;
//       }
//     });

//     // no longer a mountpoint
//     node.mounted = null;

//     // remove this mount from the child mounts
//     var idx = node.mount.mounts.indexOf(mount);
//     assert(idx !== -1);
//     node.mount.mounts.splice(idx, 1);
//   }, lookup: function (parent, name) {
//     return parent.node_ops.lookup(parent, name);
//   }, mknod: function (path, mode, dev) {
//     var lookup = FS.lookupPath(path, { parent: true });
//     var parent = lookup.node;
//     var name = PATH.basename(path);
//     if (!name || name === '.' || name === '..') {
//       throw new FS.ErrnoError(28);
//     }
//     var errCode = FS.mayCreate(parent, name);
//     if (errCode) {
//       throw new FS.ErrnoError(errCode);
//     }
//     if (!parent.node_ops.mknod) {
//       throw new FS.ErrnoError(63);
//     }
//     return parent.node_ops.mknod(parent, name, mode, dev);
//   }, create: function (path, mode) {
//     mode = mode !== undefined ? mode : 438 /* 0666 */;
//     mode &= 4095;
//     mode |= 32768;
//     return FS.mknod(path, mode, 0);
//   }, mkdir: function (path, mode) {
//     mode = mode !== undefined ? mode : 511 /* 0777 */;
//     mode &= 511 | 512;
//     mode |= 16384;
//     return FS.mknod(path, mode, 0);
//   }, mkdirTree: function (path, mode) {
//     var dirs = path.split('/');
//     var d = '';
//     for (var i = 0; i < dirs.length; ++i) {
//       if (!dirs[i]) continue;
//       d += '/' + dirs[i];
//       try {
//         FS.mkdir(d, mode);
//       } catch (e) {
//         if (e.errno != 20) throw e;
//       }
//     }
//   }, mkdev: function (path, mode, dev) {
//     if (typeof (dev) === 'undefined') {
//       dev = mode;
//       mode = 438 /* 0666 */;
//     }
//     mode |= 8192;
//     return FS.mknod(path, mode, dev);
//   }, symlink: function (oldpath, newpath) {
//     if (!PATH_FS.resolve(oldpath)) {
//       throw new FS.ErrnoError(44);
//     }
//     var lookup = FS.lookupPath(newpath, { parent: true });
//     var parent = lookup.node;
//     if (!parent) {
//       throw new FS.ErrnoError(44);
//     }
//     var newname = PATH.basename(newpath);
//     var errCode = FS.mayCreate(parent, newname);
//     if (errCode) {
//       throw new FS.ErrnoError(errCode);
//     }
//     if (!parent.node_ops.symlink) {
//       throw new FS.ErrnoError(63);
//     }
//     return parent.node_ops.symlink(parent, newname, oldpath);
//   }, rename: function (old_path, new_path) {
//     var old_dirname = PATH.dirname(old_path);
//     var new_dirname = PATH.dirname(new_path);
//     var old_name = PATH.basename(old_path);
//     var new_name = PATH.basename(new_path);
//     // parents must exist
//     var lookup, old_dir, new_dir;

//     // let the errors from non existant directories percolate up
//     lookup = FS.lookupPath(old_path, { parent: true });
//     old_dir = lookup.node;
//     lookup = FS.lookupPath(new_path, { parent: true });
//     new_dir = lookup.node;

//     if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
//     // need to be part of the same mount
//     if (old_dir.mount !== new_dir.mount) {
//       throw new FS.ErrnoError(75);
//     }
//     // source must exist
//     var old_node = FS.lookupNode(old_dir, old_name);
//     // old path should not be an ancestor of the new path
//     var relative = PATH_FS.relative(old_path, new_dirname);
//     if (relative.charAt(0) !== '.') {
//       throw new FS.ErrnoError(28);
//     }
//     // new path should not be an ancestor of the old path
//     relative = PATH_FS.relative(new_path, old_dirname);
//     if (relative.charAt(0) !== '.') {
//       throw new FS.ErrnoError(55);
//     }
//     // see if the new path already exists
//     var new_node;
//     try {
//       new_node = FS.lookupNode(new_dir, new_name);
//     } catch (e) {
//       // not fatal
//     }
//     // early out if nothing needs to change
//     if (old_node === new_node) {
//       return;
//     }
//     // we'll need to delete the old entry
//     var isdir = FS.isDir(old_node.mode);
//     var errCode = FS.mayDelete(old_dir, old_name, isdir);
//     if (errCode) {
//       throw new FS.ErrnoError(errCode);
//     }
//     // need delete permissions if we'll be overwriting.
//     // need create permissions if new doesn't already exist.
//     errCode = new_node ?
//       FS.mayDelete(new_dir, new_name, isdir) :
//       FS.mayCreate(new_dir, new_name);
//     if (errCode) {
//       throw new FS.ErrnoError(errCode);
//     }
//     if (!old_dir.node_ops.rename) {
//       throw new FS.ErrnoError(63);
//     }
//     if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
//       throw new FS.ErrnoError(10);
//     }
//     // if we are going to change the parent, check write permissions
//     if (new_dir !== old_dir) {
//       errCode = FS.nodePermissions(old_dir, 'w');
//       if (errCode) {
//         throw new FS.ErrnoError(errCode);
//       }
//     }
//     // remove the node from the lookup hash
//     FS.hashRemoveNode(old_node);
//     // do the underlying fs rename
//     try {
//       old_dir.node_ops.rename(old_node, new_dir, new_name);
//     } catch (e) {
//       throw e;
//     } finally {
//       // add the node back to the hash (in case node_ops.rename
//       // changed its name)
//       FS.hashAddNode(old_node);
//     }
//   }, rmdir: function (path) {
//     var lookup = FS.lookupPath(path, { parent: true });
//     var parent = lookup.node;
//     var name = PATH.basename(path);
//     var node = FS.lookupNode(parent, name);
//     var errCode = FS.mayDelete(parent, name, true);
//     if (errCode) {
//       throw new FS.ErrnoError(errCode);
//     }
//     if (!parent.node_ops.rmdir) {
//       throw new FS.ErrnoError(63);
//     }
//     if (FS.isMountpoint(node)) {
//       throw new FS.ErrnoError(10);
//     }
//     parent.node_ops.rmdir(parent, name);
//     FS.destroyNode(node);
//   }, readdir: function (path) {
//     var lookup = FS.lookupPath(path, { follow: true });
//     var node = lookup.node;
//     if (!node.node_ops.readdir) {
//       throw new FS.ErrnoError(54);
//     }
//     return node.node_ops.readdir(node);
//   }, unlink: function (path) {
//     var lookup = FS.lookupPath(path, { parent: true });
//     var parent = lookup.node;
//     var name = PATH.basename(path);
//     var node = FS.lookupNode(parent, name);
//     var errCode = FS.mayDelete(parent, name, false);
//     if (errCode) {
//       // According to POSIX, we should map EISDIR to EPERM, but
//       // we instead do what Linux does (and we must, as we use
//       // the musl linux libc).
//       throw new FS.ErrnoError(errCode);
//     }
//     if (!parent.node_ops.unlink) {
//       throw new FS.ErrnoError(63);
//     }
//     if (FS.isMountpoint(node)) {
//       throw new FS.ErrnoError(10);
//     }
//     parent.node_ops.unlink(parent, name);
//     FS.destroyNode(node);
//   }, readlink: function (path) {
//     var lookup = FS.lookupPath(path);
//     var link = lookup.node;
//     if (!link) {
//       throw new FS.ErrnoError(44);
//     }
//     if (!link.node_ops.readlink) {
//       throw new FS.ErrnoError(28);
//     }
//     return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
//   }, stat: function (path, dontFollow) {
//     var lookup = FS.lookupPath(path, { follow: !dontFollow });
//     var node = lookup.node;
//     if (!node) {
//       throw new FS.ErrnoError(44);
//     }
//     if (!node.node_ops.getattr) {
//       throw new FS.ErrnoError(63);
//     }
//     return node.node_ops.getattr(node);
//   }, lstat: function (path) {
//     return FS.stat(path, true);
//   }, chmod: function (path, mode, dontFollow) {
//     var node;
//     if (typeof path === 'string') {
//       var lookup = FS.lookupPath(path, { follow: !dontFollow });
//       node = lookup.node;
//     } else {
//       node = path;
//     }
//     if (!node.node_ops.setattr) {
//       throw new FS.ErrnoError(63);
//     }
//     node.node_ops.setattr(node, {
//       mode: (mode & 4095) | (node.mode & ~4095),
//       timestamp: Date.now()
//     });
//   }, lchmod: function (path, mode) {
//     FS.chmod(path, mode, true);
//   }, fchmod: function (fd, mode) {
//     var stream = FS.getStream(fd);
//     if (!stream) {
//       throw new FS.ErrnoError(8);
//     }
//     FS.chmod(stream.node, mode);
//   }, chown: function (path, uid, gid, dontFollow) {
//     var node;
//     if (typeof path === 'string') {
//       var lookup = FS.lookupPath(path, { follow: !dontFollow });
//       node = lookup.node;
//     } else {
//       node = path;
//     }
//     if (!node.node_ops.setattr) {
//       throw new FS.ErrnoError(63);
//     }
//     node.node_ops.setattr(node, {
//       timestamp: Date.now()
//       // we ignore the uid / gid for now
//     });
//   }, lchown: function (path, uid, gid) {
//     FS.chown(path, uid, gid, true);
//   }, fchown: function (fd, uid, gid) {
//     var stream = FS.getStream(fd);
//     if (!stream) {
//       throw new FS.ErrnoError(8);
//     }
//     FS.chown(stream.node, uid, gid);
//   }, truncate: function (path, len) {
//     if (len < 0) {
//       throw new FS.ErrnoError(28);
//     }
//     var node;
//     if (typeof path === 'string') {
//       var lookup = FS.lookupPath(path, { follow: true });
//       node = lookup.node;
//     } else {
//       node = path;
//     }
//     if (!node.node_ops.setattr) {
//       throw new FS.ErrnoError(63);
//     }
//     if (FS.isDir(node.mode)) {
//       throw new FS.ErrnoError(31);
//     }
//     if (!FS.isFile(node.mode)) {
//       throw new FS.ErrnoError(28);
//     }
//     var errCode = FS.nodePermissions(node, 'w');
//     if (errCode) {
//       throw new FS.ErrnoError(errCode);
//     }
//     node.node_ops.setattr(node, {
//       size: len,
//       timestamp: Date.now()
//     });
//   }, ftruncate: function (fd, len) {
//     var stream = FS.getStream(fd);
//     if (!stream) {
//       throw new FS.ErrnoError(8);
//     }
//     if ((stream.flags & 2097155) === 0) {
//       throw new FS.ErrnoError(28);
//     }
//     FS.truncate(stream.node, len);
//   }, utime: function (path, atime, mtime) {
//     var lookup = FS.lookupPath(path, { follow: true });
//     var node = lookup.node;
//     node.node_ops.setattr(node, {
//       timestamp: Math.max(atime, mtime)
//     });
//   }, open: function (path, flags, mode, fd_start, fd_end) {
//     if (path === "") {
//       throw new FS.ErrnoError(44);
//     }
//     flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
//     mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
//     if ((flags & 64)) {
//       mode = (mode & 4095) | 32768;
//     } else {
//       mode = 0;
//     }
//     var node;
//     if (typeof path === 'object') {
//       node = path;
//     } else {
//       path = PATH.normalize(path);
//       try {
//         var lookup = FS.lookupPath(path, {
//           follow: !(flags & 131072)
//         });
//         node = lookup.node;
//       } catch (e) {
//         // ignore
//       }
//     }
//     // perhaps we need to create the node
//     var created = false;
//     if ((flags & 64)) {
//       if (node) {
//         // if O_CREAT and O_EXCL are set, error out if the node already exists
//         if ((flags & 128)) {
//           throw new FS.ErrnoError(20);
//         }
//       } else {
//         // node doesn't exist, try to create it
//         node = FS.mknod(path, mode, 0);
//         created = true;
//       }
//     }
//     if (!node) {
//       throw new FS.ErrnoError(44);
//     }
//     // can't truncate a device
//     if (FS.isChrdev(node.mode)) {
//       flags &= ~512;
//     }
//     // if asked only for a directory, then this must be one
//     if ((flags & 65536) && !FS.isDir(node.mode)) {
//       throw new FS.ErrnoError(54);
//     }
//     // check permissions, if this is not a file we just created now (it is ok to
//     // create and write to a file with read-only permissions; it is read-only
//     // for later use)
//     if (!created) {
//       var errCode = FS.mayOpen(node, flags);
//       if (errCode) {
//         throw new FS.ErrnoError(errCode);
//       }
//     }
//     // do truncation if necessary
//     if ((flags & 512)) {
//       FS.truncate(node, 0);
//     }
//     // we've already handled these, don't pass down to the underlying vfs
//     flags &= ~(128 | 512 | 131072);

//     // register the stream with the filesystem
//     var stream = FS.createStream({
//       node: node,
//       path: FS.getPath(node),  // we want the absolute path to the node
//       flags: flags,
//       seekable: true,
//       position: 0,
//       stream_ops: node.stream_ops,
//       // used by the file family libc calls (fopen, fwrite, ferror, etc.)
//       ungotten: [],
//       error: false
//     }, fd_start, fd_end);
//     // call the new stream's open function
//     if (stream.stream_ops.open) {
//       stream.stream_ops.open(stream);
//     }
//     if (Module['logReadFiles'] && !(flags & 1)) {
//       if (!FS.readFiles) FS.readFiles = {};
//       if (!(path in FS.readFiles)) {
//         FS.readFiles[path] = 1;
//       }
//     }
//     return stream;
//   }, close: function (stream) {
//     if (FS.isClosed(stream)) {
//       throw new FS.ErrnoError(8);
//     }
//     if (stream.getdents) stream.getdents = null; // free readdir state
//     try {
//       if (stream.stream_ops.close) {
//         stream.stream_ops.close(stream);
//       }
//     } catch (e) {
//       throw e;
//     } finally {
//       FS.closeStream(stream.fd);
//     }
//     stream.fd = null;
//   }, isClosed: function (stream) {
//     return stream.fd === null;
//   }, llseek: function (stream, offset, whence) {
//     if (FS.isClosed(stream)) {
//       throw new FS.ErrnoError(8);
//     }
//     if (!stream.seekable || !stream.stream_ops.llseek) {
//       throw new FS.ErrnoError(70);
//     }
//     if (whence != 0 && whence != 1 && whence != 2) {
//       throw new FS.ErrnoError(28);
//     }
//     stream.position = stream.stream_ops.llseek(stream, offset, whence);
//     stream.ungotten = [];
//     return stream.position;
//   }, read: function (stream, buffer, offset, length, position) {
//     if (length < 0 || position < 0) {
//       throw new FS.ErrnoError(28);
//     }
//     if (FS.isClosed(stream)) {
//       throw new FS.ErrnoError(8);
//     }
//     if ((stream.flags & 2097155) === 1) {
//       throw new FS.ErrnoError(8);
//     }
//     if (FS.isDir(stream.node.mode)) {
//       throw new FS.ErrnoError(31);
//     }
//     if (!stream.stream_ops.read) {
//       throw new FS.ErrnoError(28);
//     }
//     var seeking = typeof position !== 'undefined';
//     if (!seeking) {
//       position = stream.position;
//     } else if (!stream.seekable) {
//       throw new FS.ErrnoError(70);
//     }
//     var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
//     if (!seeking) stream.position += bytesRead;
//     return bytesRead;
//   }, write: function (stream, buffer, offset, length, position, canOwn) {
//     if (length < 0 || position < 0) {
//       throw new FS.ErrnoError(28);
//     }
//     if (FS.isClosed(stream)) {
//       throw new FS.ErrnoError(8);
//     }
//     if ((stream.flags & 2097155) === 0) {
//       throw new FS.ErrnoError(8);
//     }
//     if (FS.isDir(stream.node.mode)) {
//       throw new FS.ErrnoError(31);
//     }
//     if (!stream.stream_ops.write) {
//       throw new FS.ErrnoError(28);
//     }
//     if (stream.seekable && stream.flags & 1024) {
//       // seek to the end before writing in append mode
//       FS.llseek(stream, 0, 2);
//     }
//     var seeking = typeof position !== 'undefined';
//     if (!seeking) {
//       position = stream.position;
//     } else if (!stream.seekable) {
//       throw new FS.ErrnoError(70);
//     }
//     var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
//     if (!seeking) stream.position += bytesWritten;
//     return bytesWritten;
//   }, allocate: function (stream, offset, length) {
//     if (FS.isClosed(stream)) {
//       throw new FS.ErrnoError(8);
//     }
//     if (offset < 0 || length <= 0) {
//       throw new FS.ErrnoError(28);
//     }
//     if ((stream.flags & 2097155) === 0) {
//       throw new FS.ErrnoError(8);
//     }
//     if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
//       throw new FS.ErrnoError(43);
//     }
//     if (!stream.stream_ops.allocate) {
//       throw new FS.ErrnoError(138);
//     }
//     stream.stream_ops.allocate(stream, offset, length);
//   }, mmap: function (stream, address, length, position, prot, flags) {
//     // User requests writing to file (prot & PROT_WRITE != 0).
//     // Checking if we have permissions to write to the file unless
//     // MAP_PRIVATE flag is set. According to POSIX spec it is possible
//     // to write to file opened in read-only mode with MAP_PRIVATE flag,
//     // as all modifications will be visible only in the memory of
//     // the current process.
//     if ((prot & 2) !== 0
//       && (flags & 2) === 0
//       && (stream.flags & 2097155) !== 2) {
//       throw new FS.ErrnoError(2);
//     }
//     if ((stream.flags & 2097155) === 1) {
//       throw new FS.ErrnoError(2);
//     }
//     if (!stream.stream_ops.mmap) {
//       throw new FS.ErrnoError(43);
//     }
//     return stream.stream_ops.mmap(stream, address, length, position, prot, flags);
//   }, msync: function (stream, buffer, offset, length, mmapFlags) {
//     if (!stream || !stream.stream_ops.msync) {
//       return 0;
//     }
//     return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
//   }, munmap: function (stream) {
//     return 0;
//   }, ioctl: function (stream, cmd, arg) {
//     if (!stream.stream_ops.ioctl) {
//       throw new FS.ErrnoError(59);
//     }
//     return stream.stream_ops.ioctl(stream, cmd, arg);
//   }, readFile: function (path, opts) {
//     opts = opts || {};
//     opts.flags = opts.flags || 0;
//     opts.encoding = opts.encoding || 'binary';
//     if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
//       throw new Error('Invalid encoding type "' + opts.encoding + '"');
//     }
//     var ret;
//     var stream = FS.open(path, opts.flags);
//     var stat = FS.stat(path);
//     var length = stat.size;
//     var buf = new Uint8Array(length);
//     FS.read(stream, buf, 0, length, 0);
//     if (opts.encoding === 'utf8') {
//       ret = UTF8ArrayToString(buf, 0);
//     } else if (opts.encoding === 'binary') {
//       ret = buf;
//     }
//     FS.close(stream);
//     return ret;
//   }, writeFile: function (path, data, opts) {
//     opts = opts || {};
//     opts.flags = opts.flags || 577;
//     var stream = FS.open(path, opts.flags, opts.mode);
//     if (typeof data === 'string') {
//       var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
//       var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
//       FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
//     } else if (ArrayBuffer.isView(data)) {
//       FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
//     } else {
//       throw new Error('Unsupported data type');
//     }
//     FS.close(stream);
//   }, cwd: function () {
//     return FS.currentPath;
//   }, chdir: function (path) {
//     var lookup = FS.lookupPath(path, { follow: true });
//     if (lookup.node === null) {
//       throw new FS.ErrnoError(44);
//     }
//     if (!FS.isDir(lookup.node.mode)) {
//       throw new FS.ErrnoError(54);
//     }
//     var errCode = FS.nodePermissions(lookup.node, 'x');
//     if (errCode) {
//       throw new FS.ErrnoError(errCode);
//     }
//     FS.currentPath = lookup.path;
//   }, createDefaultDirectories: function () {
//     FS.mkdir('/tmp');
//     FS.mkdir('/home');
//     FS.mkdir('/home/web_user');
//   }, createDefaultDevices: function () {
//     // create /dev
//     FS.mkdir('/dev');
//     // setup /dev/null
//     FS.registerDevice(FS.makedev(1, 3), {
//       read: function () { return 0; },
//       write: function (stream, buffer, offset, length, pos) { return length; }
//     });
//     FS.mkdev('/dev/null', FS.makedev(1, 3));
//     // setup /dev/tty and /dev/tty1
//     // stderr needs to print output using err() rather than out()
//     // so we register a second tty just for it.
//     TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
//     TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
//     FS.mkdev('/dev/tty', FS.makedev(5, 0));
//     FS.mkdev('/dev/tty1', FS.makedev(6, 0));
//     // setup /dev/[u]random
//     var random_device = getRandomDevice();
//     FS.createDevice('/dev', 'random', random_device);
//     FS.createDevice('/dev', 'urandom', random_device);
//     // we're not going to emulate the actual shm device,
//     // just create the tmp dirs that reside in it commonly
//     FS.mkdir('/dev/shm');
//     FS.mkdir('/dev/shm/tmp');
//   }, createSpecialDirectories: function () {
//     // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
//     // name of the stream for fd 6 (see test_unistd_ttyname)
//     FS.mkdir('/proc');
//     var proc_self = FS.mkdir('/proc/self');
//     FS.mkdir('/proc/self/fd');
//     FS.mount({
//       mount: function () {
//         var node = FS.createNode(proc_self, 'fd', 16384 | 511 /* 0777 */, 73);
//         node.node_ops = {
//           lookup: function (parent, name) {
//             var fd = +name;
//             var stream = FS.getStream(fd);
//             if (!stream) throw new FS.ErrnoError(8);
//             var ret = {
//               parent: null,
//               mount: { mountpoint: 'fake' },
//               node_ops: { readlink: function () { return stream.path } }
//             };
//             ret.parent = ret; // make it look like a simple root node
//             return ret;
//           }
//         };
//         return node;
//       }
//     }, {}, '/proc/self/fd');
//   }, createStandardStreams: function () {
//     // TODO deprecate the old functionality of a single
//     // input / output callback and that utilizes FS.createDevice
//     // and instead require a unique set of stream ops

//     // by default, we symlink the standard streams to the
//     // default tty devices. however, if the standard streams
//     // have been overwritten we create a unique device for
//     // them instead.
//     if (Module['stdin']) {
//       FS.createDevice('/dev', 'stdin', Module['stdin']);
//     } else {
//       FS.symlink('/dev/tty', '/dev/stdin');
//     }
//     if (Module['stdout']) {
//       FS.createDevice('/dev', 'stdout', null, Module['stdout']);
//     } else {
//       FS.symlink('/dev/tty', '/dev/stdout');
//     }
//     if (Module['stderr']) {
//       FS.createDevice('/dev', 'stderr', null, Module['stderr']);
//     } else {
//       FS.symlink('/dev/tty1', '/dev/stderr');
//     }

//     // open default streams for the stdin, stdout and stderr devices
//     var stdin = FS.open('/dev/stdin', 0);
//     var stdout = FS.open('/dev/stdout', 1);
//     var stderr = FS.open('/dev/stderr', 1);
//     assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
//     assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
//     assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
//   }, ensureErrnoError: function () {
//     if (FS.ErrnoError) return;
//     FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
//       this.node = node;
//       this.setErrno = /** @this{Object} */ function (errno) {
//         this.errno = errno;
//         for (var key in ERRNO_CODES) {
//           if (ERRNO_CODES[key] === errno) {
//             this.code = key;
//             break;
//           }
//         }
//       };
//       this.setErrno(errno);
//       this.message = ERRNO_MESSAGES[errno];

//       // Try to get a maximally helpful stack trace. On Node.js, getting Error.stack
//       // now ensures it shows what we want.
//       if (this.stack) {
//         // Define the stack property for Node.js 4, which otherwise errors on the next line.
//         Object.defineProperty(this, "stack", { value: (new Error).stack, writable: true });
//         this.stack = demangleAll(this.stack);
//       }
//     };
//     FS.ErrnoError.prototype = new Error();
//     FS.ErrnoError.prototype.constructor = FS.ErrnoError;
//     // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
//     [44].forEach(function (code) {
//       FS.genericErrors[code] = new FS.ErrnoError(code);
//       FS.genericErrors[code].stack = '<generic error, no stack>';
//     });
//   }, staticInit: function () {
//     FS.ensureErrnoError();

//     FS.nameTable = new Array(4096);

//     FS.mount(MEMFS, {}, '/');

//     FS.createDefaultDirectories();
//     FS.createDefaultDevices();
//     FS.createSpecialDirectories();

//     FS.filesystems = {
//       'MEMFS': MEMFS,
//     };
//   }, init: function (input, output, error) {
//     assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
//     FS.init.initialized = true;

//     FS.ensureErrnoError();

//     FS.createStandardStreams();
//   }, quit: function () {
//     FS.init.initialized = false;
//     // force-flush all streams, so we get musl std streams printed out
//     var fflush = Module['_fflush'];
//     if (fflush) fflush(0);
//     // close all of our streams
//     for (var i = 0; i < FS.streams.length; i++) {
//       var stream = FS.streams[i];
//       if (!stream) {
//         continue;
//       }
//       FS.close(stream);
//     }
//   }, getMode: function (canRead: number, canWrite: number) {
//     var mode = 0;
//     if (canRead) mode |= 292 | 73;
//     if (canWrite) mode |= 146;
//     return mode;
//   }, findObject: function (path: string, dontResolveLastLink: any) {
//     var ret = FS.analyzePath(path, dontResolveLastLink);
//     if (ret.exists) {
//       return ret.object;
//     } else {
//       return null;
//     }
//   }, analyzePath: function (path, dontResolveLastLink) {
//     // operate from within the context of the symlink's target
//     try {
//       var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
//       path = lookup.path;
//     } catch (e) {
//     }
//     var ret = {
//       isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
//       parentExists: false, parentPath: null, parentObject: null
//     };
//     try {
//       var lookup = FS.lookupPath(path, { parent: true });
//       ret.parentExists = true;
//       ret.parentPath = lookup.path;
//       ret.parentObject = lookup.node;
//       ret.name = PATH.basename(path);
//       lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
//       ret.exists = true;
//       ret.path = lookup.path;
//       ret.object = lookup.node;
//       ret.name = lookup.node.name;
//       ret.isRoot = lookup.path === '/';
//     } catch (e) {
//       ret.error = e.errno;
//     };
//     return ret;
//   }, createPath: function (parent, path, canRead, canWrite) {
//     parent = typeof parent === 'string' ? parent : FS.getPath(parent);
//     var parts = path.split('/').reverse();
//     while (parts.length) {
//       var part = parts.pop();
//       if (!part) continue;
//       var current = PATH.join2(parent, part);
//       try {
//         FS.mkdir(current);
//       } catch (e) {
//         // ignore EEXIST
//       }
//       parent = current;
//     }
//     return current;
//   }, createFile: function (parent, name, properties, canRead, canWrite) {
//     var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
//     var mode = FS.getMode(canRead, canWrite);
//     return FS.create(path, mode);
//   }, createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
//     var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
//     var mode = FS.getMode(canRead, canWrite);
//     var node = FS.create(path, mode);
//     if (data) {
//       if (typeof data === 'string') {
//         var arr = new Array(data.length);
//         for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
//         data = arr;
//       }
//       // make sure we can write to the file
//       FS.chmod(node, mode | 146);
//       var stream = FS.open(node, 577);
//       FS.write(stream, data, 0, data.length, 0, canOwn);
//       FS.close(stream);
//       FS.chmod(node, mode);
//     }
//     return node;
//   }, createDevice: function (parent, name, input, output) {
//     var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
//     var mode = FS.getMode(!!input, !!output);
//     if (!FS.createDevice.major) FS.createDevice.major = 64;
//     var dev = FS.makedev(FS.createDevice.major++, 0);
//     // Create a fake device that a set of stream ops to emulate
//     // the old behavior.
//     FS.registerDevice(dev, {
//       open: function (stream) {
//         stream.seekable = false;
//       },
//       close: function (stream) {
//         // flush any pending line data
//         if (output && output.buffer && output.buffer.length) {
//           output(10);
//         }
//       },
//       read: function (stream, buffer, offset, length, pos /* ignored */) {
//         var bytesRead = 0;
//         for (var i = 0; i < length; i++) {
//           var result;
//           try {
//             result = input();
//           } catch (e) {
//             throw new FS.ErrnoError(29);
//           }
//           if (result === undefined && bytesRead === 0) {
//             throw new FS.ErrnoError(6);
//           }
//           if (result === null || result === undefined) break;
//           bytesRead++;
//           buffer[offset + i] = result;
//         }
//         if (bytesRead) {
//           stream.node.timestamp = Date.now();
//         }
//         return bytesRead;
//       },
//       write: function (stream, buffer, offset, length, pos) {
//         for (var i = 0; i < length; i++) {
//           try {
//             output(buffer[offset + i]);
//           } catch (e) {
//             throw new FS.ErrnoError(29);
//           }
//         }
//         if (length) {
//           stream.node.timestamp = Date.now();
//         }
//         return i;
//       }
//     });
//     return FS.mkdev(path, mode, dev);
//   }, forceLoadFile: function (obj) {
//     if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
//     if (typeof XMLHttpRequest !== 'undefined') {
//       throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
//     } else if (read_) {
//       // Command-line.
//       try {
//         // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
//         //          read() will try to parse UTF8.
//         obj.contents = intArrayFromString(read_(obj.url), true);
//         obj.usedBytes = obj.contents.length;
//       } catch (e) {
//         throw new FS.ErrnoError(29);
//       }
//     } else {
//       throw new Error('Cannot load without read() or XMLHttpRequest.');
//     }
//   }, createLazyFile: function (parent, name, url, canRead, canWrite) {
//     // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
//     /** @constructor */
//     function LazyUint8Array() {
//       this.lengthKnown = false;
//       this.chunks = []; // Loaded chunks. Index is the chunk number
//     }
//     LazyUint8Array.prototype.get = /** @this{Object} */ function LazyUint8Array_get(idx) {
//       if (idx > this.length - 1 || idx < 0) {
//         return undefined;
//       }
//       var chunkOffset = idx % this.chunkSize;
//       var chunkNum = (idx / this.chunkSize) | 0;
//       return this.getter(chunkNum)[chunkOffset];
//     };
//     LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
//       this.getter = getter;
//     };
//     LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
//       // Find length
//       var xhr = new XMLHttpRequest();
//       xhr.open('HEAD', url, false);
//       xhr.send(null);
//       if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
//       var datalength = Number(xhr.getResponseHeader("Content-length"));
//       var header;
//       var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
//       var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";

//       var chunkSize = 1024 * 1024; // Chunk size in bytes

//       if (!hasByteServing) chunkSize = datalength;

//       // Function to get a range from the remote URL.
//       var doXHR = (function (from, to) {
//         if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
//         if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");

//         // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
//         var xhr = new XMLHttpRequest();
//         xhr.open('GET', url, false);
//         if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);

//         // Some hints to the browser that we want binary data.
//         if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
//         if (xhr.overrideMimeType) {
//           xhr.overrideMimeType('text/plain; charset=x-user-defined');
//         }

//         xhr.send(null);
//         if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
//         if (xhr.response !== undefined) {
//           return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
//         } else {
//           return intArrayFromString(xhr.responseText || '', true);
//         }
//       });
//       var lazyArray = this;
//       lazyArray.setDataGetter(function (chunkNum) {
//         var start = chunkNum * chunkSize;
//         var end = (chunkNum + 1) * chunkSize - 1; // including this byte
//         end = Math.min(end, datalength - 1); // if datalength-1 is selected, this is the last block
//         if (typeof (lazyArray.chunks[chunkNum]) === "undefined") {
//           lazyArray.chunks[chunkNum] = doXHR(start, end);
//         }
//         if (typeof (lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
//         return lazyArray.chunks[chunkNum];
//       });

//       if (usesGzip || !datalength) {
//         // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
//         chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
//         datalength = this.getter(0).length;
//         chunkSize = datalength;
//         out("LazyFiles on gzip forces download of the whole file when length is accessed");
//       }

//       this._length = datalength;
//       this._chunkSize = chunkSize;
//       this.lengthKnown = true;
//     };
//     if (typeof XMLHttpRequest !== 'undefined') {
//       if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
//       var lazyArray = new LazyUint8Array();
//       Object.defineProperties(lazyArray, {
//         length: {
//           get: /** @this{Object} */ function () {
//             if (!this.lengthKnown) {
//               this.cacheLength();
//             }
//             return this._length;
//           }
//         },
//         chunkSize: {
//           get: /** @this{Object} */ function () {
//             if (!this.lengthKnown) {
//               this.cacheLength();
//             }
//             return this._chunkSize;
//           }
//         }
//       });

//       var properties = { isDevice: false, contents: lazyArray };
//     } else {
//       var properties = { isDevice: false, url: url };
//     }

//     var node = FS.createFile(parent, name, properties, canRead, canWrite);
//     // This is a total hack, but I want to get this lazy file code out of the
//     // core of MEMFS. If we want to keep this lazy file concept I feel it should
//     // be its own thin LAZYFS proxying calls to MEMFS.
//     if (properties.contents) {
//       node.contents = properties.contents;
//     } else if (properties.url) {
//       node.contents = null;
//       node.url = properties.url;
//     }
//     // Add a function that defers querying the file size until it is asked the first time.
//     Object.defineProperties(node, {
//       usedBytes: {
//         get: /** @this {FSNode} */ function () { return this.contents.length; }
//       }
//     });
//     // override each stream op with one that tries to force load the lazy file first
//     var stream_ops = {};
//     var keys = Object.keys(node.stream_ops);
//     keys.forEach(function (key) {
//       var fn = node.stream_ops[key];
//       stream_ops[key] = function forceLoadLazyFile() {
//         FS.forceLoadFile(node);
//         return fn.apply(null, arguments);
//       };
//     });
//     // use a custom read function
//     stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
//       FS.forceLoadFile(node);
//       var contents = stream.node.contents;
//       if (position >= contents.length)
//         return 0;
//       var size = Math.min(contents.length - position, length);
//       assert(size >= 0);
//       if (contents.slice) { // normal array
//         for (var i = 0; i < size; i++) {
//           buffer[offset + i] = contents[position + i];
//         }
//       } else {
//         for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
//           buffer[offset + i] = contents.get(position + i);
//         }
//       }
//       return size;
//     };
//     node.stream_ops = stream_ops;
//     return node;
//   }, createPreloadedFile: function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
//     Browser.init(); // XXX perhaps this method should move onto Browser?
//     // TODO we should allow people to just pass in a complete filename instead
//     // of parent and name being that we just join them anyways
//     var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
//     var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
//     function processData(byteArray) {
//       function finish(byteArray) {
//         if (preFinish) preFinish();
//         if (!dontCreateFile) {
//           FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
//         }
//         if (onload) onload();
//         removeRunDependency(dep);
//       }
//       var handled = false;
//       Module['preloadPlugins'].forEach(function (plugin) {
//         if (handled) return;
//         if (plugin['canHandle'](fullname)) {
//           plugin['handle'](byteArray, fullname, finish, function () {
//             if (onerror) onerror();
//             removeRunDependency(dep);
//           });
//           handled = true;
//         }
//       });
//       if (!handled) finish(byteArray);
//     }
//     addRunDependency(dep);
//     if (typeof url == 'string') {
//       asyncLoad(url, function (byteArray) {
//         processData(byteArray);
//       }, onerror);
//     } else {
//       processData(url);
//     }
//   }, indexedDB: function () {
//     return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//   }, DB_NAME: function () {
//     return 'EM_FS_' + window.location.pathname;
//   }, DB_VERSION: 20, DB_STORE_NAME: "FILE_DATA", saveFilesToDB: function (paths, onload, onerror) {
//     onload = onload || function () { };
//     onerror = onerror || function () { };
//     var indexedDB = FS.indexedDB();
//     try {
//       var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
//     } catch (e) {
//       return onerror(e);
//     }
//     openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
//       out('creating db');
//       var db = openRequest.result;
//       db.createObjectStore(FS.DB_STORE_NAME);
//     };
//     openRequest.onsuccess = function openRequest_onsuccess() {
//       var db = openRequest.result;
//       var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
//       var files = transaction.objectStore(FS.DB_STORE_NAME);
//       var ok = 0, fail = 0, total = paths.length;
//       function finish() {
//         if (fail == 0) onload(); else onerror();
//       }
//       paths.forEach(function (path) {
//         var putRequest = files.put(FS.analyzePath(path).object.contents, path);
//         putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
//         putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
//       });
//       transaction.onerror = onerror;
//     };
//     openRequest.onerror = onerror;
//   }, loadFilesFromDB: function (paths, onload, onerror) {
//     onload = onload || function () { };
//     onerror = onerror || function () { };
//     var indexedDB = FS.indexedDB();
//     try {
//       var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
//     } catch (e) {
//       return onerror(e);
//     }
//     openRequest.onupgradeneeded = onerror; // no database to load from
//     openRequest.onsuccess = function openRequest_onsuccess() {
//       var db = openRequest.result;
//       try {
//         var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
//       } catch (e) {
//         onerror(e);
//         return;
//       }
//       var files = transaction.objectStore(FS.DB_STORE_NAME);
//       var ok = 0, fail = 0, total = paths.length;
//       function finish() {
//         if (fail == 0) onload(); else onerror();
//       }
//       paths.forEach(function (path) {
//         var getRequest = files.get(path);
//         getRequest.onsuccess = function getRequest_onsuccess() {
//           if (FS.analyzePath(path).exists) {
//             FS.unlink(path);
//           }
//           FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
//           ok++;
//           if (ok + fail == total) finish();
//         };
//         getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
//       });
//       transaction.onerror = onerror;
//     };
//     openRequest.onerror = onerror;
//   }, absolutePath: function () {
//     abort('FS.absolutePath has been removed; use PATH_FS.resolve instead');
//   }, createFolder: function () {
//     abort('FS.createFolder has been removed; use FS.mkdir instead');
//   }, createLink: function () {
//     abort('FS.createLink has been removed; use FS.symlink instead');
//   }, joinPath: function () {
//     abort('FS.joinPath has been removed; use PATH.join instead');
//   }, mmapAlloc: function () {
//     abort('FS.mmapAlloc has been replaced by the top level function mmapAlloc');
//   }, standardizePath: function () {
//     abort('FS.standardizePath has been removed; use PATH.normalize instead');
//   }
};

  export {FS, PATH}