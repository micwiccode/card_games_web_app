<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\JoinTable;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="Users")
 */
class User implements UserInterface
{

    const ROLE_ADMIN = "ROLE_ADMIN";
    const ROLE_USER = "ROLE_USER";
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $email;


    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User", inversedBy="friendsWithMe")
     * @JoinTable(name="friends",
     *      joinColumns={@JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="friend_user_id", referencedColumnName="id")}
     *      )
     */
    private $myFriends;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User", mappedBy="myFriends")
     */
    private $friendsWithMe;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Player", mappedBy="userId", orphanRemoval=true)
     */
    private $gamesPlayed;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\FriendRequest", mappedBy="friend")
     */
    private $friendRequests;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Room")
     */
    private $room;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isRoomAdmin = false;

    public function __construct()
    {
        $this->myFriends = new ArrayCollection();
        $this->friendsWithMe = new ArrayCollection();
        $this->gamesPlayed = new ArrayCollection();
        $this->friendRequests = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = self::ROLE_USER;

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function addRole(string $role): self {
        $this->roles[] = $role;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }


    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }


    /**
     * @return Collection|self[]
     */
    public function getMyFriends(): Collection
    {
        return $this->myFriends;
    }

    public function addMyFriend(self $myFriend): self
    {
        if (!$this->myFriends->contains($myFriend)) {
            $this->myFriends[] = $myFriend;
        }

        return $this;
    }

    public function removeMyFriend(self $myFriend): self
    {
        if ($this->myFriends->contains($myFriend)) {
            $this->myFriends->removeElement($myFriend);
        }

        return $this;
    }

    /**
     * @return Collection|self[]
     */
    public function getFriendsWithMe(): Collection
    {
        return $this->friendsWithMe;
    }

    public function addFriendsWithMe(self $friendsWithMe): self
    {
        if (!$this->friendsWithMe->contains($friendsWithMe)) {
            $this->friendsWithMe[] = $friendsWithMe;
            $friendsWithMe->addMyFriend($this);
        }

        return $this;
    }

    public function removeFriendsWithMe(self $friendsWithMe): self
    {
        if ($this->friendsWithMe->contains($friendsWithMe)) {
            $this->friendsWithMe->removeElement($friendsWithMe);
            $friendsWithMe->removeMyFriend($this);
        }

        return $this;
    }


    /**
     * @return Collection|Player[]
     */
    public function getGamesPlayed(): Collection
    {
        return $this->gamesPlayed;
    }

    public function addGamesPlayed(Player $gamesPlayed): self
    {
        if (!$this->gamesPlayed->contains($gamesPlayed)) {
            $this->gamesPlayed[] = $gamesPlayed;
            $gamesPlayed->setUser($this);
        }

        return $this;
    }

    public function removeGamesPlayed(Player $gamesPlayed): self
    {
        if ($this->gamesPlayed->contains($gamesPlayed)) {
            $this->gamesPlayed->removeElement($gamesPlayed);
            // set the owning side to null (unless already changed)
            if ($gamesPlayed->getUser() === $this) {
                $gamesPlayed->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|FriendRequest[]
     */
    public function getFriendRequests(): Collection
    {
        return $this->friendRequests;
    }

    public function addFriendRequest(FriendRequest $friendRequest): self
    {
        if (!$this->friendRequests->contains($friendRequest)) {
            $this->friendRequests[] = $friendRequest;
            $friendRequest->setFriend($this);
        }

        return $this;
    }

    public function removeFriendRequest(FriendRequest $friendRequest): self
    {
        if ($this->friendRequests->contains($friendRequest)) {
            $this->friendRequests->removeElement($friendRequest);
            // set the owning side to null (unless already changed)
            if ($friendRequest->getFriend() === $this) {
                $friendRequest->setFriend(null);
            }
        }

        return $this;
    }

    public function getRoom(): ?Room
    {
        return $this->room;
    }

    public function setRoom(?Room $room): self
    {
        $this->room = $room;

        return $this;
    }

    public function getIsRoomAdmin(): ?bool
    {
        return $this->isRoomAdmin;
    }

    public function setIsRoomAdmin(bool $isRoomAdmin): self
    {
        $this->isRoomAdmin = $isRoomAdmin;

        return $this;
    }
}
